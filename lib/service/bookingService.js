import { auth, db } from '@/lib/config';
import { 
  collection, 
  getDocs,
  doc, 
  getDoc, 
  runTransaction 
} from 'firebase/firestore';

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

    const workshopDocRef = doc(db, 'workshops', bookingData.workshopId);
    
    // 2. Use a Transaction to check availability and update seats
    const result = await runTransaction(db, async (transaction) => {
      const workshopSnap = await transaction.get(workshopDocRef);
      
      if (!workshopSnap.exists()) {
        throw new Error('Workshop not found.');
      }

      const workshop = workshopSnap.data();
      
      if (workshop.status !== 'PUBLISHED') {
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
      const bookingsCollection = collection(db, 'bookings');
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
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be authenticated to view bookings');
    }

    // Check if user has admin role
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.');
    }

    const userData = userDocSnap.data();
    const userRole = userData.role;

    if (userRole !== 'admin') {
      throw new Error('Access denied. Admin role required to view bookings.');
    }

    // Get all bookings from Firestore
    const bookingsCollection = collection(db, 'bookings');
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

    // 2. Check authentication
    const user = auth.currentUser
    if (!user) {
      throw new Error('You must be authenticated to update booking status')
    }

    // 3. Check admin role
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.')
    }

    const userData = userDocSnap.data()
    if (userData.role !== 'admin') {
      throw new Error('Access denied. Admin role required.')
    }

    const bookingDocRef = doc(db, 'bookings', bookingId)

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

