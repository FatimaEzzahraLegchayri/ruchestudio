'use client'

import { useEffect, useState } from 'react'
import { SideBar } from '@/components/admin/side-bar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/service/categorieService'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmation } from '@/components/workShop/DeleteConfirmation'
import { PaginationHelper } from '@/components/admin/pagination-helper'

interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  // Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editedName, setEditedName] = useState('')
  const [updating, setUpdating] = useState(false)

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data as Category[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    try {
      setAdding(true)
      await addCategory({ name: newCategory })
      setNewCategory('')
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editedName.trim()) return
    try {
      setUpdating(true)
      await updateCategory(editingCategory.id, editedName)
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: editedName } : cat
        )
      )
      setEditingCategory(null)
    } catch (err) {
      setError('Failed to update category')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategory(categoryToDelete.id)
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id))
      setCategoryToDelete(null)
    } catch (err) {
      setError('Failed to delete category')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="flex min-h-screen">
      <SideBar />

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage workshop categories</p>
          </div>

          <Card className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={handleAddCategory} disabled={adding}>
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Add</>}
              </Button>
            </div>
          </Card>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error}</div>
          )}

          <Card className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No categories found</p>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {currentCategories.map((category) => (
                  <Card key={category.id} className="p-4 flex items-center justify-between hover:shadow-sm transition">
                    <p className="font-semibold">{category.name}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => {
                          setEditingCategory(category)
                          setEditedName(category.name)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="hover:text-destructive"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}

                
              </div>
            )}
            <div className="mt-6 border-t pt-6">
                    <PaginationHelper 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
            </div>
          </Card>
        </div>
      </main>

      {/* Reusable Delete Confirmation */}
      <DeleteConfirmation
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        workshopTitle={categoryToDelete?.name} 
      />

      {/* Edit Modal */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Input 
            value={editedName} 
            onChange={(e) => setEditedName(e.target.value)} 
            placeholder="Category name" 
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
            <Button onClick={handleUpdateCategory} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}