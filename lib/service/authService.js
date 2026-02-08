import { firebaseLogin, firebaseSignup } from '../auth';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export async function signin(email, password) {
  try {
    const userCredential = await firebaseLogin(email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await signOut(auth);
      throw new Error('User not found. Access denied.');
    }

    const userData = userDocSnap.data();
    const userRole = userData.role;

    if (userRole !== 'admin') {
      await signOut(auth);
      throw new Error('Access denied. Admin role required.');
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      role: userRole,
      ...userData
    };
  } catch (error) {
    if (error.message === 'Access denied. Admin role required.' || 
        error.message === 'User not found. Access denied.') {
      throw error;
    }
    throw new Error(`Login failed: incorrect email or password`);
  }
}

export async function signup(name, email, password, role = 'admin') {
  try {
    const userCredential = await firebaseSignup(email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      name: name,
      email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
    });

    return {
      uid: user.uid,
      name: name,
      email: user.email,
      // displayName: user.displayName,
      emailVerified: user.emailVerified,
      role: role,
    };
  } catch (error) {
    throw new Error(`Signup failed: please try again`);
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}
