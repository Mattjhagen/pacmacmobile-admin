'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import ProductForm from '@/components/ProductForm'
import ProductCard from '@/components/ProductCard'
import ImportModal from '@/components/ImportModal'

interface Product {
  id: string
  name: string
  brand: string
  model: string
  price: number
  description?: string
  imageUrl?: string
  specs?: any
  inStock: boolean
  stockCount: number
  category: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchingImages, setFetchingImages] = useState(false)
  const [fetchingSpecs, setFetchingSpecs] = useState(false)

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleProductCreated = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleImportComplete = () => {
    setShowImportModal(false)
    fetchProducts()
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleFetchImages = async () => {
    const productsWithoutImages = products.filter(p => !p.imageUrl)
    
    if (productsWithoutImages.length === 0) {
      alert('All products already have images!')
      return
    }

    if (!confirm(`Fetch images for ${productsWithoutImages.length} products without images? This may take a few minutes.`)) {
      return
    }

    setFetchingImages(true)
    try {
      const response = await fetch('/api/fetch-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: productsWithoutImages.map(p => p.id)
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`Successfully updated ${result.updated} products with images!`)
        fetchProducts()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      alert('Error fetching images')
    } finally {
      setFetchingImages(false)
    }
  }

  const handleFetchSpecs = async () => {
    const productsWithoutSpecs = products.filter(p => !p.specs || Object.keys(p.specs).length === 0)
    
    if (productsWithoutSpecs.length === 0) {
      alert('All products already have specifications!')
      return
    }

    if (!confirm(`Fetch specifications for ${productsWithoutSpecs.length} products? This may take several minutes.`)) {
      return
    }

    setFetchingSpecs(true)
    try {
      const response = await fetch('/api/fetch-specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: productsWithoutSpecs.map(p => p.id)
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`Successfully updated ${result.updated} products with specifications!`)
        fetchProducts()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error fetching specifications:', error)
      alert('Error fetching specifications')
    } finally {
      setFetchingSpecs(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-gray-600">Manage your phone inventory</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Import from wesellcellular
              </button>
              <button
                onClick={handleFetchImages}
                disabled={fetchingImages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchingImages ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <PhotoIcon className="h-5 w-5 mr-2" />
                )}
                {fetchingImages ? 'Fetching...' : 'Fetch Images'}
              </button>
              <button
                onClick={handleFetchSpecs}
                disabled={fetchingSpecs}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchingSpecs ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                )}
                {fetchingSpecs ? 'Fetching...' : 'Fetch Specs'}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <ProductForm
                product={editingProduct}
                onSuccess={handleProductCreated}
                onCancel={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
              />
            </div>
          </div>
        )}

        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first phone product.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
