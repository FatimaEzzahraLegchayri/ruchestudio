import { auth, db } from '@/lib/config';
import { 
  collection, 
  getDocs,
  doc, 
  getDoc, addDoc, setDoc, updateDoc,
  runTransaction, increment, serverTimestamp,
} from 'firebase/firestore';
import { ensureAdmin } from '@/lib/helper';


const WORKSHOPS_COLLECTION = 'workshops';
const PAUSE_ART_COLLECTION = 'pauseArt';
const PAUSE_ART_BOOKINGS_COLLECTION = 'pauseArtBookings';
const WORKSHOPS_BOOKINGS_COLLECTION = 'workshopBookings';
const CORPORATE_BOOKINGS_COLLECTION = 'corporateBookings';


export async function newBooking(bookingData) {
  try {
    const email = bookingData.email?.trim().toLowerCase() || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      throw new Error("L'adresse email n'est pas valide.");
    }
    const bookingsRef = collection(db, WORKSHOPS_BOOKINGS_COLLECTION);
    const newDocRef = doc(bookingsRef); 

    const draftBooking = {
      workshopId: bookingData.workshopId,
      workshopTitle: bookingData.workshopTitle,
      name: bookingData.name.trim(),
      email: bookingData.email?.trim().toLowerCase() || "",
      phone: bookingData.phone.trim(),
      status: "draft", 
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newDocRef, draftBooking);

    return { id: newDocRef.id, ...draftBooking };
  } catch (error) {
    console.error("Error creating lead:", error);
    throw new Error("Impossible d'initialiser la réservation.");
  }
}

export async function updateBookingWithPayment(bookingId, imageUrl) {
  try {
    const bookingRef = doc(db, WORKSHOPS_BOOKINGS_COLLECTION, bookingId);
 
    await updateDoc(bookingRef, {
      paymentProofUrl: imageUrl,
      status: "pending",
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
}
 

export async function getBookings() {
  try {
    await ensureAdmin();

    const bookingsCollection = collection(db, WORKSHOPS_BOOKINGS_COLLECTION);
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
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}
 
export async function updateBooking(bookingId, newStatus) {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'canceled'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Statut invalide');
    }

    await ensureAdmin();
    const bookingDocRef = doc(db, WORKSHOPS_BOOKINGS_COLLECTION, bookingId);

    await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingDocRef);
      if (!bookingSnap.exists()) {
        throw new Error('Réservation introuvable');
      }

      const bookingData = bookingSnap.data();
      const oldStatus = bookingData.status;
      const workshopId = bookingData.workshopId;

      if (oldStatus === newStatus) return;

      const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
      const workshopSnap = await transaction.get(workshopDocRef);

      if (!workshopSnap.exists()) {
        throw new Error('Atelier associé introuvable');
      }

      const workshopData = workshopSnap.data();
      const currentBooked = workshopData.bookedSeats || 0;
      const capacity = workshopData.capacity || 0;

      if (newStatus === 'confirmed') {
        if (currentBooked >= capacity) {
          throw new Error('Impossible de confirmer : L\'atelier est complet.');
        }
        transaction.update(workshopDocRef, { 
          bookedSeats: increment(1),
          updatedAt: serverTimestamp() 
        });
      }

      if (oldStatus === 'confirmed' && newStatus !== 'confirmed') {
        transaction.update(workshopDocRef, { 
          bookedSeats: increment(-1),
          updatedAt: serverTimestamp()
        });
      }

      transaction.update(bookingDocRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    });

    return { success: true, status: newStatus };

  } catch (error) {
    console.error('Update Booking Error:', error);
    throw error;
  }
}

export async function newPauseBooking(bookingData) {
  try {
    const required = ['pauseArtId', 'name', 'phone', 'paymentImage', 'whyJoin', 'lastTimeForSelf'];
    const missing = required.filter(field => !bookingData[field]);

    if (missing.length > 0) {
      throw new Error(`Champs manquants: ${missing.join(', ')}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      throw new Error('Format d\'email invalide');
    }

    const eventDocRef = doc(db, PAUSE_ART_COLLECTION, bookingData.pauseArtId);

    const result = await runTransaction(db, async (transaction) => {
      const eventSnap = await transaction.get(eventDocRef);
      
      if (!eventSnap.exists()) {
        throw new Error("Cette session n'existe plus.");
      }

      const eventData = eventSnap.data();
      
      if (eventData.status !== 'published') {
        throw new Error("Cette session n'est plus disponible à la réservation.");
      }

      const currentBooked = eventData.bookedSeats || 0;
      if (currentBooked >= eventData.capacity) {
        throw new Error("Cette session est malheureusement complète.");
      }

      const now = new Date().toISOString();

      const participantEntry = {
        pauseArtId: bookingData.pauseArtId,
        eventTitle: eventData.title,
        eventDate: eventData.date,   
        name: bookingData.name.trim(),
        email: bookingData.email.trim().toLowerCase(),
        phone: bookingData.phone.trim(),
        whyJoin: bookingData.whyJoin.trim(),
        lastTimeForSelf: bookingData.lastTimeForSelf.trim(),
        paymentProofUrl: bookingData.paymentImage, 
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      const bookingsCollection = collection(db, PAUSE_ART_BOOKINGS_COLLECTION);
      const newBookingRef = doc(bookingsCollection); 
      
      transaction.set(newBookingRef, participantEntry);
      transaction.update(eventDocRef, {
        bookedSeats: increment(1),
        updatedAt: now,
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
    await ensureAdmin();

    const bookingsCollection = collection(db, PAUSE_ART_BOOKINGS_COLLECTION);
    const bookingsSnapshot = await getDocs(bookingsCollection);

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookings;
  } catch (error) {
    if (
      error.message.includes('Access denied') || 
      error.message.includes('User must be authenticated')
    ) {
      throw error;
    }
    
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

    const bookingData = {
      ...formData,
      workshopType: formData.workshopType === "autre" 
        ? `Autre: ${formData.customWorkshopType}` 
        : formData.workshopType,
      location: formData.location === "autre" 
        ? `Autre: ${formData.customLocation}` 
        : formData.location,
      status: "pending", 
      createdAt: serverTimestamp(), 
    };

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