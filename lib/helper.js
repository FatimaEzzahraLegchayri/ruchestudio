import { auth, db } from '@/lib/config';
import { doc, getDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export async function ensureAdmin() {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to perform this action');
  }

  const userDocRef = doc(db, USERS_COLLECTION, user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error('User account not found. Access denied.');
  }

  const userData = userDocSnap.data();
  if (userData.role !== 'admin') {
    throw new Error('Access denied. Admin role required.');
  }

  return user; // Return user in case you need the UID for the service
}