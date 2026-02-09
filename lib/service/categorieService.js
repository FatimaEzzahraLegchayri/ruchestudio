import { auth, db } from '@/lib/config'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  runTransaction,
  deleteDoc
} from 'firebase/firestore'

export async function getCategories() {
  try {
    // 1. Check authentication
    const user = auth.currentUser
    if (!user) {
      throw new Error('You must be authenticated to view categories')
    }

    // 2. Check admin role
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.')
    }

    const userData = userDocSnap.data()
    if (userData.role !== 'admin') {
      throw new Error('Access denied. Admin role required.')
    }

    // 3. Fetch categories
    const categoriesCollection = collection(db, 'categories')
    const categoriesSnapshot = await getDocs(categoriesCollection)

    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return categories
  } catch (error) {
    console.error('Get Categories Error:', error)

    if (
      error.message.includes('Access denied') ||
      error.message.includes('authenticated')
    ) {
      throw error
    }

    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

export async function addCategory(categoryData) {
  try {
    // 1. Validate input
    if (!categoryData?.name) {
      throw new Error('Category name is required')
    }

    const name = categoryData.name.trim()
    if (name.length < 2) {
      throw new Error('Category name must be at least 2 characters long')
    }

    const slug =
      categoryData.slug?.trim().toLowerCase() ||
      name.toLowerCase().replace(/\s+/g, '-')

    // 2. Check authentication
    const user = auth.currentUser
    if (!user) {
      throw new Error('You must be authenticated to add a category')
    }

    // 3. Check admin role
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.')
    }

    if (userDocSnap.data().role !== 'admin') {
      throw new Error('Access denied. Admin role required.')
    }

    const categoriesCollection = collection(db, 'categories')

    // 4. Transaction: check duplicate + create
    const result = await runTransaction(db, async (transaction) => {
      // Check if category with same slug already exists
      const existingQuery = query(
        categoriesCollection,
        where('slug', '==', slug)
      )

      const existingSnap = await getDocs(existingQuery)

      if (!existingSnap.empty) {
        throw new Error('Category already exists')
      }

      const newCategoryRef = doc(categoriesCollection)
      const now = new Date().toISOString()

      const category = {
        name,
        slug,
        createdAt: now,
        updatedAt: now,
      }

      transaction.set(newCategoryRef, category)

      return { id: newCategoryRef.id, ...category }
    })

    return result
  } catch (error) {
    console.error('Add Category Error:', error)
    throw error
  }
}

export async function updateCategory(categoryId, newName) {
  try {
    // 1. Validate input
    if (!newName || newName.trim().length < 2) {
      throw new Error('Category name must be at least 2 characters long')
    }

    const name = newName.trim()
    const slug = name.toLowerCase().replace(/\s+/g, '-')

    // 2. Check authentication
    const user = auth.currentUser
    if (!user) {
      throw new Error('You must be authenticated to update a category')
    }

    // 3. Check admin role
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.')
    }

    if (userDocSnap.data().role !== 'admin') {
      throw new Error('Access denied. Admin role required.')
    }

    const categoryDocRef = doc(db, 'categories', categoryId)
    const categoriesCollection = collection(db, 'categories')

    // 4. Transaction: check duplicate + update
    await runTransaction(db, async (transaction) => {
      const categorySnap = await transaction.get(categoryDocRef)

      if (!categorySnap.exists()) {
        throw new Error('Category not found')
      }

      // Check if another category already has this slug
      const duplicateQuery = query(
        categoriesCollection,
        where('slug', '==', slug)
      )

      const duplicateSnap = await getDocs(duplicateQuery)

      const isDuplicate = duplicateSnap.docs.some(
        (doc) => doc.id !== categoryId
      )

      if (isDuplicate) {
        throw new Error('Another category with this name already exists')
      }

      transaction.update(categoryDocRef, {
        name,
        slug,
        updatedAt: new Date().toISOString(),
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Update Category Error:', error)
    throw error
  }
}

export async function deleteCategory(categoryId) {
  try {
    // 1. Validate input
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    // 2. Check authentication
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be authenticated to delete a category');
    }

    // 3. Check admin role
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('User not found. Access denied.');
    }

    if (userDocSnap.data().role !== 'admin') {
      throw new Error('Access denied. Admin role required.');
    }

    // 4. Reference the category document
    const categoryDocRef = doc(db, 'categories', categoryId);
    
    // Check if it exists before deleting (optional, but good for error handling)
    const categorySnap = await getDoc(categoryDocRef);
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    // 5. Delete the document
    await deleteDoc(categoryDocRef);

    return { success: true, id: categoryId };
  } catch (error) {
    console.error('Delete Category Error:', error);
    throw error;
  }
}
