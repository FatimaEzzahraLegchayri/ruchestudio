import { collection, addDoc, doc, getDoc, updateDoc, getDocs, deleteDoc,
  query, orderBy, where, limit
} from 'firebase/firestore';
import { auth, db } from '@/lib/config';
import { ensureAdmin } from '@/lib/helper';

const WORKSHOPS_COLLECTION = 'workshops';
const PAUSE_ART_COLLECTION = 'pauseArt';



export async function addWorkshop(workshopData) {
  try {
    await ensureAdmin();

    // Prepare workshop document
    const now = new Date().toISOString();
    const workshop = {
      title: workshopData.title,
      description: workshopData?.description || '',
      date: workshopData.date,
      startTime: workshopData.startTime,
      endTime: workshopData.endTime,
      // duration: workshopData.duration,
      category: workshopData?.category || '',
      capacity: workshopData.capacity,
      bookedSeats: 0, 
      price: workshopData.price,
      status: workshopData.status || 'draft', 
      image: workshopData.image || null, 
      createdAt: now,
      updatedAt: now,
    };

    // Validate required fields
    const requiredFields = ['title', 'date', 'startTime', 'endTime', 'capacity', 'price'];
    const missingFields = requiredFields.filter(field => {
      const value = workshop[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Add workshop to Firestore
    const workshopsCollection = collection(db, WORKSHOPS_COLLECTION);
    const docRef = await addDoc(workshopsCollection, workshop);

    // Return the created workshop with id
    return {
      id: docRef.id,
      ...workshop,
    };
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Missing required fields')) {
      throw error;
    }
    throw new Error(`Failed to add workshop: ${error.message}`);
  }
}

export async function updateWorkshop(workshopId, updateData) {
  try {
   
    await ensureAdmin();

    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
    const workshopDocSnap = await getDoc(workshopDocRef);

    if (!workshopDocSnap.exists()) {
      throw new Error('Workshop not found.');
    }

    const updateObject = {};
    
    const allowedFields = ['title', 'description', 'date', 'startTime', 'endTime', 'category', 'capacity', 'bookedSeats', 'price', 'status', 'image'];
    
    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        updateObject[field] = updateData[field];
      }
    });

    updateObject.updatedAt = new Date().toISOString();

    if (Object.keys(updateObject).length === 1 && updateObject.updatedAt) {
      throw new Error('No valid fields to update.');
    }

    await updateDoc(workshopDocRef, updateObject);

    const updatedDocSnap = await getDoc(workshopDocRef);
    const updatedData = updatedDocSnap.data();

    // Return the updated workshop with id
    return {
      id: workshopId,
      ...updatedData,
    };
  } catch (error) {
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Workshop not found') ||
        error.message.includes('No valid fields to update')) {
      throw error;
    }
    throw new Error(`Failed to update workshop: ${error.message}`);
  }
}

export async function deleteWorkshop(workshopId) {
  try {
    // Check if user is authenticated
    await ensureAdmin();

    // Check if workshop exists
    const workshopDocRef = doc(db, WORKSHOPS_COLLECTION, workshopId);
    const workshopDocSnap = await getDoc(workshopDocRef);

    if (!workshopDocSnap.exists()) {
      throw new Error('Workshop not found.');
    }

    // Delete workshop from Firestore
    await deleteDoc(workshopDocRef);

    return { success: true, id: workshopId };
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Access denied') || 
        error.message.includes('User must be authenticated') ||
        error.message.includes('Workshop not found')) {
      throw error;
    }
    throw new Error(`Failed to delete workshop: ${error.message}`);
  }
}

export async function getWorkshops() {
  try {
    // Get all workshops from Firestore
    const workshopsCollection = collection(db, WORKSHOPS_COLLECTION);
    const workshopsSnapshot = await getDocs(workshopsCollection);

    // Map the documents to include id
    const workshops = workshopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return workshops;
  } catch (error) {
    throw new Error(`Failed to fetch workshops: ${error.message}`);
  }
}
 
export async function confirmationEmail(emailData) {
  try {
    const brevoApiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.warn('Brevo API key not found. Email will not be sent.');
      return; // Don't throw error, just skip email sending
    }

    // Format date for display
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch {
        return dateString;
      }
    };

    // Format time for display
    const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedDate = formatDate(emailData.workshopDate);
    const formattedTime = formatTime(emailData.workshopTime);

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${emailData.toName},</p>
              <p>Thank you for booking a workshop with Broderie by Bel! Your booking has been confirmed.</p>

              <div class="details">
                <h2 style="margin-top: 0;">Workshop Details</h2>
                <div class="detail-row">
                  <span class="label">Workshop:</span> <span class="value">${emailData.workshopTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span> <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span> <span class="value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span> <span class="value">${emailData.workshopPrice} DH</span>
                </div>
              </div>

              <p>We look forward to seeing you at the workshop!</p>
              
              <div class="footer">
                <p>Best regards,<br>The Broderie by Bel Team</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text content
    const textContent = `
Booking Confirmation

Dear ${emailData.toName},

Thank you for booking a workshop with Broderie by Bel! Your booking has been confirmed.

Workshop Details:
- Workshop: ${emailData.workshopTitle}
- Date: ${formattedDate}
- Time: ${formattedTime}
- Price: ${emailData.workshopPrice} DH

We look forward to seeing you at the workshop!

Best regards,
The Broderie by Bel Team
    `;

    // Brevo API endpoint for sending transactional emails
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Broderie by Bel',
          email: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'noreply@broderiebybel.com',
        },
        to: [
          {
            email: emailData.toEmail,
            name: emailData.toName,
          },
        ],
        subject: `Booking Confirmation: ${emailData.workshopTitle}`,
        htmlContent: htmlContent,
        textContent: textContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Brevo API error:', errorData);
      // Don't throw error - email failure shouldn't break the booking
      return;
    }

    console.log('Confirmation email sent successfully');
  } catch (error) {
    // Log error but don't throw - email failure shouldn't break the booking
    console.error('Failed to send confirmation email:', error.message);
  }
} 

export async function addPauseArt(eventData) {
  try {
    // 1. Validation of essential fields (Status is handled by default below)
    const requiredFields = [
      'title', 
      'date', 
      'startTime', 
      'price', 
      'capacity', 
      // 'image'
    ];
    
    const missingFields = requiredFields.filter(field => !eventData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
    }

    const now = new Date().toISOString();
    
    // 2. Prepare the document structure
    const newPauseArtSession = {
      title: eventData.title.trim(),
      description: eventData.description?.trim() || '',
      date: eventData.date, 
      startTime: eventData.startTime,
      endTime: eventData.endTime || '',
      price: Number(eventData.price),
      capacity: Number(eventData.capacity),
      bookedSeats: 0, 
      // image: eventData.image, 
      
      // Fallback logic: use provided status or default to 'draft'
      status: eventData.status || 'draft', 
      
      todos: Array.isArray(eventData.todos) ? eventData.todos : [],
      
      createdAt: now,
      updatedAt: now,
    };

    // 3. Save to Firestore
    const pauseArtRef = collection(db, PAUSE_ART_COLLECTION);
    const docRef = await addDoc(pauseArtRef, newPauseArtSession);

    return {
      id: docRef.id,
      ...newPauseArtSession
    };

  } catch (error) {
    console.error("Erreur lors de la création de la Pause d'Art:", error);
    throw error;
  }
}

// Fetches all Pause d'Art sessions for the Admin panel
export async function getPauseArt() {
  try {
    await ensureAdmin();

    const pauseArtRef = collection(db, PAUSE_ART_COLLECTION);
    const q = query(pauseArtRef, orderBy('date', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.id,
      ...doc.data()
    }));

    return sessions;
  } catch (error) {
    console.error("Error fetching all Pause d'Art:", error);
    throw error;
  }
}

export async function getPublishedPauseArt() {
  try {
    const pauseArtRef = collection(db, PAUSE_ART_COLLECTION);
    const q = query(
      pauseArtRef, 
      where('status', '==', 'published'), 
      limit(1) 
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; 
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };

  } catch (error) {
    console.error("Error fetching published pause art:", error);
    throw error;
  }
}

export async function updatePauseArt(id, updateData) {
  try {
    await ensureAdmin();

    // 3. Document Existence Check
    const pauseArtRef = doc(db, PAUSE_ART_COLLECTION, id);
    const pauseArtSnap = await getDoc(pauseArtRef);

    if (!pauseArtSnap.exists()) {
      throw new Error('Session Pause d\'Art introuvable.');
    }

    // 4. White-listing Allowed Fields
    const updateObject = {};
    const allowedFields = [
      'title', 
      'description', 
      'date', 
      'startTime', 
      'endTime', 
      'price', 
      'capacity', 
      'bookedSeats', 
      'status', 
      // 'image', 
      'todos'
    ];

    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        // Ensure numbers are stored as numbers
        if (field === 'price' || field === 'capacity' || field === 'bookedSeats') {
          updateObject[field] = Number(updateData[field]);
        } else {
          updateObject[field] = updateData[field];
        }
      }
    });

    // 5. Add Timestamp
    updateObject.updatedAt = new Date().toISOString();

    // 6. Prevent empty updates
    if (Object.keys(updateObject).length === 1) { // Only contains updatedAt
      throw new Error('Aucune donnée valide à mettre à jour.');
    }

    // 7. Execute Update
    await updateDoc(pauseArtRef, updateObject);

    // 8. Return fresh data
    const updatedDocSnap = await getDoc(pauseArtRef);
    return {
      id,
      ...updatedDocSnap.data(),
    };

  } catch (error) {
    console.error("Update Error:", error);
    // Re-throw specific errors for the UI to handle
    throw error;
  }
}


export async function deletePauseArt(sessionId) {
  try {
    await ensureAdmin();

    // 3. Check if the Pause d'Art session exists
    const sessionDocRef = doc(db, PAUSE_ART_COLLECTION, sessionId);
    const sessionDocSnap = await getDoc(sessionDocRef);

    if (!sessionDocSnap.exists()) {
      throw new Error('Session not found.');
    }

    // 4. Delete session from Firestore
    await deleteDoc(sessionDocRef);

    return { success: true, id: sessionId };
  } catch (error) {
    // 5. Re-throw validation errors as per original pattern
    if (
      error.message.includes('Access denied') || 
      error.message.includes('User must be authenticated') ||
      error.message.includes('Session not found')
    ) {
      throw error;
    }
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}