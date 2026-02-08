import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
  } from 'firebase/auth';
import { auth } from './config';
  
export function firebaseLogin(email, password) {
   return signInWithEmailAndPassword(auth, email, password);
}

export function firebaseSignup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
  
export async function firebaseLogout() {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }
  
    await signOut(auth);
}
  