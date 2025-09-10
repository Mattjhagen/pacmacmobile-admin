
'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { PlusIcon, ArrowUpTrayIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
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
  specs?: Record<string, unknown>
  inStock: boolean
  stockCount: number
  category: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [fetchingImages, setFetchingImages] = useState(false)
  const [fetchingSpecs, setFetchingSpecs] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [certValidated, setCertValidated] = useState(false)
  const [certData, setCertData] = useState({ certKey: '', deviceId: '' })

  // Certificate validation system
  const validateCertificate = (certKey: string, deviceId: string) => {
    // Generate a hash of the certificate key and device ID
    const combinedString = certKey + deviceId + 'PACMAC_SECURE_2024'
    
    // Simple hash function (you can make this more sophisticated)
    let hash = 0
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Check against expected hash (this would be your secret validation)
    const expectedHash = 1234567890 // Change this to your secret hash
    const isValid = Math.abs(hash) === expectedHash
    
    // Additional validation: check if certKey matches expected pattern
    const validCertPattern = /^PACMAC-[A-Z0-9]{8}-[A-Z0-9]{8}$/
    const validDevicePattern = /^DEV-[A-Z0-9]{6}$/
    
    return isValid && validCertPattern.test(certKey) && validDevicePattern.test(deviceId)
  }

  const handleCertValidation = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateCertificate(certData.certKey, certData.deviceId)) {
      setCertValidated(true)
      setCertData({ certKey: '', deviceId: '' })
    } else {
      alert('Invalid security certificate. Access denied.')
      setCertData({ certKey: '', deviceId: '' })
    }
  }

  // Simple authentication handler
  const handleSimpleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginData.username === 'admin' && loginData.password === 'pacmac2024') {
      setIsAuthenticated(true)
      setLoginData({ username: '', password: '' })
    } else {
      alert('Invalid username or password. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([]) // Set empty array on error
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated])

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

  // Certificate validation screen
  if (!certValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-red-800 mb-2">🔒 Security Certificate Required</h1>
            <p className="text-red-600">Please provide your security certificate to access the admin system.</p>
          </div>
          
          <form onSubmit={handleCertValidation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Certificate Key</label>
              <input
                type="text"
                placeholder="PACMAC-XXXXXXXX-XXXXXXXX"
                value={certData.certKey}
                onChange={(e) => setCertData({...certData, certKey: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
              <input
                type="text"
                placeholder="DEV-XXXXXX"
                value={certData.deviceId}
                onChange={(e) => setCertData({...certData, deviceId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              🔐 Validate Certificate
            </button>
          </form>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Certificate format: PACMAC-XXXXXXXX-XXXXXXXX</p>
            <p>Device ID format: DEV-XXXXXX</p>
          </div>
        </div>
      </div>
    )
  }

  // Login screen (only shown after certificate validation)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-green-800 mb-2">✅ Certificate Validated</h1>
            <p className="text-green-600">Security certificate accepted. Please sign in to continue.</p>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📱 PacMac Mobile Admin</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the inventory management system</p>
          
          <form onSubmit={handleSimpleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🔐 Sign In
            </button>
          </form>
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
              <p className="text-gray-600">Manage your phone inventory.</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Welcome, admin!</p>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 py-4 border-t border-gray-200">
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
            {(products || []).map((product) => (
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
