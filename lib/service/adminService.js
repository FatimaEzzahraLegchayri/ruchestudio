import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/config';


export async function updateProfile(profileData) {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to update profile');
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
      throw new Error('Access denied. Admin role required.');
    }

    const updateData = {};
    let passwordUpdated = false;

    // Update name in Firestore if provided
    if (profileData.name !== undefined && profileData.name !== null) {
      if (typeof profileData.name !== 'string' || profileData.name.trim() === '') {
        throw new Error('Name cannot be empty');
      }
      updateData.name = profileData.name.trim();
      updateData.updatedAt = new Date().toISOString();
    }

    // Update password if provided
    if (profileData.password !== undefined && profileData.password !== null) {
      if (!profileData.currentPassword) {
        throw new Error('Current password is required to update password');
      }

      if (typeof profileData.password !== 'string' || profileData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, profileData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, profileData.password);
      passwordUpdated = true;
    }

    // Update Firestore if there are changes
    if (Object.keys(updateData).length > 0) {
      await updateDoc(userDocRef, updateData);
    }

    // Get updated user data
    const updatedDocSnap = await getDoc(userDocRef);
    const updatedUserData = updatedDocSnap.data();

    return {
      uid: user.uid,
      email: user.email,
      name: updatedUserData.name,
      role: updatedUserData.role,
      passwordUpdated,
      ...updatedUserData,
    };
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Access denied') ||
        error.message.includes('User must be authenticated') ||
        error.message.includes('User not found') ||
        error.message.includes('Name cannot be empty') ||
        error.message.includes('Current password is required') ||
        error.message.includes('Password must be at least')) {
      throw error;
    }

    // Handle Firebase Auth errors
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Current password is incorrect');
    }

    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please choose a stronger password');
    }

    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function getProfile() {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to view profile');
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
      throw new Error('Access denied. Admin role required.');
    }

    // Return user profile information
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      name: userData.name || '',
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      ...userData,
    };
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes('Access denied') ||
        error.message.includes('User must be authenticated') ||
        error.message.includes('User not found')) {
      throw error;
    }
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
}
