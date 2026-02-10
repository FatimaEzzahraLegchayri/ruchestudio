import { auth, db } from '@/lib/config';
import { 
  collection, 
  getDocs,
  doc, 
  getDoc, addDoc,
  runTransaction, increment, serverTimestamp
} from 'firebase/firestore';
import { ensureAdmin } from '@/lib/helper';


const WORKSHOPS_COLLECTION = 'workshops';
const PAUSE_ART_COLLECTION = 'pauseArt';
const PAUSE_ART_BOOKINGS_COLLECTION = 'pauseArtBookings';
const WORKSHOPS_BOOKINGS_COLLECTION = 'workshopBookings';
const CORPORATE_BOOKINGS_COLLECTION = 'corporateBookings';
// const ADMIN_COLLECTION = 'admin';

export async function newBooking(bookingData) {
  try {
    // 1. Validate required fields
    const requiredFields = ['workshopId', 'name', 'email', 'phone', 'paymentImage'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      throw new Error('Invalid email format');
    }

    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, bookingData.workshopId);
    
    // 2. Use a Transaction to check availability and update seats
    const result = await runTransaction(db, async (transaction) => {
      const workshopSnap = await transaction.get(workshopDocRef);
      
      if (!workshopSnap.exists()) {
        throw new Error('Workshop not found.');
      }

      const workshop = workshopSnap.data();
      
      if (workshop.status !== 'published') {
        throw new Error('This workshop is not available for booking.');
      }

      const availableSeats = workshop.capacity - (workshop.bookedSeats || 0);
      if (availableSeats <= 0) {
        throw new Error('Workshop is fully booked.');
      }

      // 3. Prepare the booking document
      // NOTE: We use the URL string provided by Cloudinary
      const now = new Date().toISOString();
      const booking = {
        workshopId: bookingData.workshopId,
        workshopTitle: workshop.title,
        name: bookingData.name.trim(),
        email: bookingData.email.trim().toLowerCase(),
        phone: bookingData.phone.trim(),
        paymentProofUrl: bookingData.paymentImage, // This is the Cloudinary URL
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      // 4. Create the booking and increment seats
      const bookingsCollection = collection(db, WORKSHOPS_BOOKINGS_COLLECTION);
      const newBookingRef = doc(bookingsCollection); 
      
      transaction.set(newBookingRef, booking);
      transaction.update(workshopDocRef, {
        bookedSeats: (workshop.bookedSeats || 0) + 1,
        updatedAt: now,
      });

      return { id: newBookingRef.id, ...booking };
    });

    return result;

  } catch (error) {
    console.error("Booking Error:", error);
    // Re-throw specific errors for the UI to catch
    throw error;
  }
}

export async function getBookings() {
  try {
    await ensureAdmin();

    // Get all bookings from Firestore
    const bookingsCollection = collection(db, WORKSHOPS_BOOKINGS_COLLECTION);
    const bookingsSnapshot = await getDocs(bookingsCollection);

    // Map the documents to include id
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated')) {
      throw error;
    }
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

export async function updateBooking(bookingId, newStatus) {
  try {
    // 1. Validate status
    const allowedStatuses = ['pending', 'confirmed', 'canceled']
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid booking status')
    }

    await ensureAdmin();

    const bookingDocRef = doc(db, WORKSHOPS_BOOKINGS_COLLECTION, bookingId)

    // 4. Transaction: update booking status
    await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingDocRef)

      if (!bookingSnap.exists()) {
        throw new Error('Booking not found')
      }

      transaction.update(bookingDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
    })

    return { success: true, status: newStatus }

  } catch (error) {
    console.error('Update Booking Error:', error)
    throw error
  }
}


export async function newPauseBooking(bookingData) {
  try {
    // 1. Validation
    const required = ['pauseArtId', 'name', 'phone', 'paymentImage', 'whyJoin', 'lastTimeForSelf'];
    const missing = required.filter(field => !bookingData[field]);

    if (missing.length > 0) {
      throw new Error(`Champs manquants: ${missing.join(', ')}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      throw new Error('Format d\'email invalide');
    }

    // Reference to the specific Pause d'Art event
    const eventDocRef = doc(db, PAUSE_ART_COLLECTION, bookingData.pauseArtId);

    // 2. Transactional Update
    const result = await runTransaction(db, async (transaction) => {
      const eventSnap = await transaction.get(eventDocRef);
      
      if (!eventSnap.exists()) {
        throw new Error("Cette session n'existe plus.");
      }

      const eventData = eventSnap.data();
      
      // Check if event is open for booking
      if (eventData.status !== 'published') {
        throw new Error("Cette session n'est plus disponible à la réservation.");
      }

      // Check capacity
      const currentBooked = eventData.bookedSeats || 0;
      if (currentBooked >= eventData.capacity) {
        throw new Error("Cette session est malheureusement complète.");
      }

      const now = new Date().toISOString();

      // 3. Prepare Participant Data
      const participantEntry = {
        pauseArtId: bookingData.pauseArtId,
        eventTitle: eventData.title, // Cached for easier admin viewing
        eventDate: eventData.date,   // Cached for easier admin viewing
        name: bookingData.name.trim(),
        email: bookingData.email.trim().toLowerCase(),
        phone: bookingData.phone.trim(),
        whyJoin: bookingData.whyJoin.trim(),
        lastTimeForSelf: bookingData.lastTimeForSelf.trim(),
        paymentProofUrl: bookingData.paymentImage, // Cloudinary URL
        status: 'pending', // Waiting for admin to verify payment
        createdAt: now,
        updatedAt: now,
      };

      // 4. Execute: Create booking and increment event seats
      const bookingsCollection = collection(db, PAUSE_ART_BOOKINGS_COLLECTION);
      const newBookingRef = doc(bookingsCollection); 
      
      transaction.set(newBookingRef, participantEntry);
      transaction.update(eventDocRef, {
        bookedSeats: increment(1),
        updatedAt: now,
        // Auto-update status to fully booked if this was the last seat
        status: (currentBooked + 1) >= eventData.capacity ? 'fully booked' : 'published'
      });

      return { id: newBookingRef.id, ...participantEntry };
    });

    return result;

  } catch (error) {
    console.error("Pause Art Booking Error:", error);
    throw error;
  }
}

export async function getPauseArtBookings() {
  try {
    // 1. Ensure the user has administrative privileges
    await ensureAdmin();

    // 2. Reference the Pause Art bookings collection
    const bookingsCollection = collection(db, PAUSE_ART_BOOKINGS_COLLECTION);
    const bookingsSnapshot = await getDocs(bookingsCollection);

    // 3. Map documents to objects including the Firestore ID
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    // 4. Re-throw validation/auth errors directly
    if (
      error.message.includes('Access denied') || 
      error.message.includes('User must be authenticated')
    ) {
      throw error;
    }
    
    // 5. Wrap generic Firestore or unexpected errors
    throw new Error(`Failed to fetch Pause Art bookings: ${error.message}`);
  }
}


export async function updatePauseArtBookingStatus(bookingId, newStatus) {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'canceled'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid booking status');
    }

    await ensureAdmin();

    const bookingDocRef = doc(db, PAUSE_ART_BOOKINGS_COLLECTION, bookingId);

    // 3. Transaction to ensure data integrity
    await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingDocRef);

      if (!bookingSnap.exists()) {
        throw new Error('Booking not found');
      }

      transaction.update(bookingDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    });

    return { success: true, status: newStatus };

  } catch (error) {
    console.error('Update Pause Art Booking Error:', error);
    throw error;
  }
}


export async function newCorporateBookings(formData) {
  try {
    const corporateCollection = collection(db, CORPORATE_BOOKINGS_COLLECTION);

    // Prepare the data payload
    const bookingData = {
      ...formData,
      // Ensure we explicitly note if they chose 'autre'
      workshopType: formData.workshopType === "autre" 
        ? `Autre: ${formData.customWorkshopType}` 
        : formData.workshopType,
      location: formData.location === "autre" 
        ? `Autre: ${formData.customLocation}` 
        : formData.location,
      status: "pending", 
      createdAt: serverTimestamp(), 
    };

    // Remove the temporary 'custom' fields if they are now merged or redundant
    delete bookingData.customWorkshopType;
    delete bookingData.customLocation;

    const docRef = await addDoc(corporateCollection, bookingData);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving corporate booking:", error);
    throw new Error(`Failed to submit request: ${error.message}`);
  }
}

export async function getCorporateBookings() {
  try {
    await ensureAdmin();

    const bookingsCollection = collection(db, CORPORATE_BOOKINGS_COLLECTION);
    const bookingsSnapshot = await getDocs(bookingsCollection);

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated')) {
      throw error;
    }
    throw new Error(`Failed to fetch corporate bookings: ${error.message}`);
  }
}

export async function updateCorporateBookingStatus(bookingId, newStatus) {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'canceled'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid booking status');
    }

    await ensureAdmin();

    const bookingDocRef = doc(db, CORPORATE_BOOKINGS_COLLECTION, bookingId);

    await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingDocRef);

      if (!bookingSnap.exists()) {
        throw new Error('Booking not found');
      }

      transaction.update(bookingDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    });

    return { success: true, status: newStatus };

  } catch (error) {
    console.error('Update Corporate Booking Error:', error);
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message === 'Invalid booking status' ||
        error.message === 'Booking not found') {
      throw error;
    }
    throw new Error(`Failed to update corporate booking: ${error.message}`);
  }
}