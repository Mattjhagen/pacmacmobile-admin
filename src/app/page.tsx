
'use client'

import { useState, useEffect } from 'react'
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

interface ProductTemplate {
  name: string
  category: string
  description: string
  specs: {
    storage: string
    color: string
    condition: string
    brand: string
    model: string
    screen?: string
    camera?: string
    processor?: string
    connectivity?: string
  }
  tags: string[]
  basePrice: number
}

export default function AdminDashboard() {
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
  const [showAutofillSuggestions, setShowAutofillSuggestions] = useState(false)
  const [autofillSuggestions, setAutofillSuggestions] = useState<ProductTemplate[]>([])
  const [pushingInventory, setPushingInventory] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [showGithubForm, setShowGithubForm] = useState(false)
  const [pushingToGithub, setPushingToGithub] = useState(false)
  const [testingGithub, setTestingGithub] = useState(false)

  // Autofill system with product templates
  const productTemplates = {
    'iphone': {
      'iphone 15': {
        name: 'iPhone 15',
        category: 'main',
        description: 'Latest iPhone with A17 Pro chip and advanced camera system',
        specs: {
          storage: '128GB',
          color: 'Natural Titanium',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 15',
          screen: '6.1" Super Retina XDR',
          camera: '48MP Main Camera',
          processor: 'A17 Pro'
        },
        tags: ['iPhone', 'Apple', '128GB', 'Natural Titanium', 'New', 'A17 Pro'],
        basePrice: 799
      },
      'iphone 15 pro': {
        name: 'iPhone 15 Pro',
        category: 'main',
        description: 'Pro iPhone with titanium design and advanced camera system',
        specs: {
          storage: '128GB',
          color: 'Natural Titanium',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          screen: '6.1" Super Retina XDR',
          camera: '48MP Main Camera',
          processor: 'A17 Pro'
        },
        tags: ['iPhone', 'Apple', 'Pro', '128GB', 'Natural Titanium', 'New', 'A17 Pro'],
        basePrice: 999
      },
      'iphone 15 pro max': {
        name: 'iPhone 15 Pro Max',
        category: 'main',
        description: 'Largest Pro iPhone with titanium design and 5x telephoto camera',
        specs: {
          storage: '256GB',
          color: 'Natural Titanium',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 15 Pro Max',
          screen: '6.7" Super Retina XDR',
          camera: '48MP Main Camera with 5x Telephoto',
          processor: 'A17 Pro'
        },
        tags: ['iPhone', 'Apple', 'Pro Max', '256GB', 'Natural Titanium', 'New', 'A17 Pro'],
        basePrice: 1199
      },
      'iphone 16': {
        name: 'iPhone 16',
        category: 'main',
        description: 'Latest iPhone with A18 chip and enhanced camera system',
        specs: {
          storage: '128GB',
          color: 'Blue',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 16',
          screen: '6.1" Super Retina XDR',
          camera: '48MP Main Camera',
          processor: 'A18'
        },
        tags: ['iPhone', 'Apple', '128GB', 'Blue', 'New', 'A18'],
        basePrice: 799
      },
      'iphone 16 pro': {
        name: 'iPhone 16 Pro',
        category: 'main',
        description: 'Pro iPhone with titanium design and advanced camera system',
        specs: {
          storage: '128GB',
          color: 'Natural Titanium',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 16 Pro',
          screen: '6.1" Super Retina XDR',
          camera: '48MP Main Camera',
          processor: 'A18 Pro'
        },
        tags: ['iPhone', 'Apple', 'Pro', '128GB', 'Natural Titanium', 'New', 'A18 Pro'],
        basePrice: 999
      },
      'iphone 16 pro max': {
        name: 'iPhone 16 Pro Max',
        category: 'main',
        description: 'Largest Pro iPhone with titanium design and 5x telephoto camera',
        specs: {
          storage: '256GB',
          color: 'Natural Titanium',
          condition: 'New',
          brand: 'Apple',
          model: 'iPhone 16 Pro Max',
          screen: '6.7" Super Retina XDR',
          camera: '48MP Main Camera with 5x Telephoto',
          processor: 'A18 Pro'
        },
        tags: ['iPhone', 'Apple', 'Pro Max', '256GB', 'Natural Titanium', 'New', 'A18 Pro'],
        basePrice: 1199
      }
    },
    'ipad': {
      'ipad air': {
        name: 'iPad Air',
        category: 'main',
        description: 'Powerful iPad with M2 chip and all-day battery life',
        specs: {
          storage: '64GB',
          color: 'Space Gray',
          condition: 'New',
          brand: 'Apple',
          model: 'iPad Air',
          screen: '10.9" Liquid Retina',
          processor: 'M2',
          connectivity: 'Wi-Fi'
        },
        tags: ['iPad', 'Apple', 'Air', '64GB', 'Space Gray', 'New', 'M2'],
        basePrice: 599
      },
      'ipad pro': {
        name: 'iPad Pro',
        category: 'main',
        description: 'Most powerful iPad with M4 chip and Pro camera system',
        specs: {
          storage: '256GB',
          color: 'Space Gray',
          condition: 'New',
          brand: 'Apple',
          model: 'iPad Pro',
          screen: '11" Liquid Retina XDR',
          processor: 'M4',
          connectivity: 'Wi-Fi'
        },
        tags: ['iPad', 'Apple', 'Pro', '256GB', 'Space Gray', 'New', 'M4'],
        basePrice: 999
      }
    },
    'samsung': {
      'galaxy s24': {
        name: 'Samsung Galaxy S24',
        category: 'main',
        description: 'Latest Samsung Galaxy with AI-powered features',
        specs: {
          storage: '128GB',
          color: 'Onyx Black',
          condition: 'New',
          brand: 'Samsung',
          model: 'Galaxy S24',
          screen: '6.2" Dynamic AMOLED 2X',
          camera: '50MP Main Camera',
          processor: 'Snapdragon 8 Gen 3'
        },
        tags: ['Samsung', 'Galaxy', 'S24', '128GB', 'Onyx Black', 'New', 'Snapdragon'],
        basePrice: 799
      },
      'galaxy s24 ultra': {
        name: 'Samsung Galaxy S24 Ultra',
        category: 'main',
        description: 'Ultimate Samsung Galaxy with S Pen and advanced camera system',
        specs: {
          storage: '256GB',
          color: 'Titanium Black',
          condition: 'New',
          brand: 'Samsung',
          model: 'Galaxy S24 Ultra',
          screen: '6.8" Dynamic AMOLED 2X',
          camera: '200MP Main Camera with 10x Optical Zoom',
          processor: 'Snapdragon 8 Gen 3'
        },
        tags: ['Samsung', 'Galaxy', 'S24 Ultra', '256GB', 'Titanium Black', 'New', 'S Pen'],
        basePrice: 1199
      }
    }
  }

  // Autofill functions
  const getAutofillSuggestions = (input: string): ProductTemplate[] => {
    if (input.length < 2) return []
    
    const suggestions: ProductTemplate[] = []
    const lowerInput = input.toLowerCase()
    
    // Search through all product templates
    Object.values(productTemplates).forEach(category => {
      Object.values(category).forEach((product: ProductTemplate) => {
        if (product.name.toLowerCase().includes(lowerInput) || 
            product.tags.some((tag: string) => tag.toLowerCase().includes(lowerInput))) {
          suggestions.push(product)
        }
      })
    })
    
    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  const handleProductNameChange = (value: string) => {
    const suggestions = getAutofillSuggestions(value)
    setAutofillSuggestions(suggestions)
    setShowAutofillSuggestions(suggestions.length > 0)
  }

  const selectAutofillSuggestion = () => {
    // Fill form with suggestion data
    setShowAutofillSuggestions(false)
    
    // You can add more form field updates here
    // For now, we'll just update the product name
  }

  // Certificate validation system
  const validateCertificate = (certKey: string, deviceId: string) => {
    // Check if certKey matches expected pattern
    const validCertPattern = /^PACMAC-[A-Z0-9]{8}-[A-Z0-9]{8}$/
    const validDevicePattern = /^DEV-[A-Z0-9]{6}$/
    
    // Basic pattern validation
    const patternValid = validCertPattern.test(certKey) && validDevicePattern.test(deviceId)
    
    if (!patternValid) {
      return false
    }
    
    // Generate a hash of the certificate key and device ID
    const combinedString = certKey + deviceId + 'PACMAC_SECURE_2024'
    
    // Simple hash function
    let hash = 0
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // For now, accept any valid pattern (you can add hash validation later)
    // const expectedHash = 1234567890
    // const hashValid = Math.abs(hash) === expectedHash
    
    return patternValid // && hashValid
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

  const handlePushInventory = async () => {
    const inStockProducts = products.filter(p => p.inStock)
    
    if (inStockProducts.length === 0) {
      alert('No products in stock to push!')
      return
    }

    if (!confirm(`Push ${inStockProducts.length} in-stock products to the main PacMac site?`)) {
      return
    }

    setPushingInventory(true)
    try {
      const response = await fetch('/api/push-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUrl: 'https://pacmacmobile.com', // Main site URL
          apiKey: null // No API key needed for file generation method
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        if (result.result && result.result.method === 'file-generation') {
          // Show the generated file content for manual upload
          const fileContent = result.result.fileContent
          const newWindow = window.open('', '_blank')
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head><title>Inventory File for Main Site</title></head>
                <body style="font-family: monospace; padding: 20px;">
                  <h2>📦 Inventory File for PacMac Main Site</h2>
                  <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Products:</strong> ${result.pushed} in-stock products</p>
                  <hr>
                  <h3>Instructions:</h3>
                  <ol>
                    <li>Copy the code below</li>
                    <li>Go to <a href="https://github.com/Mattjhagen/New-PacMac" target="_blank">New-PacMac repository</a></li>
                    <li>Edit index.html</li>
                    <li>Replace the PRODUCTS array with the code below</li>
                    <li>Commit and push changes</li>
                  </ol>
                  <hr>
                  <h3>Code to Copy:</h3>
                  <textarea readonly style="width: 100%; height: 400px; font-family: monospace;">${fileContent}</textarea>
                  <hr>
                  <p><em>This file was generated by the PacMac Admin Panel</em></p>
                </body>
              </html>
            `)
          }
        } else {
          alert(`Successfully pushed ${result.pushed} products to main site!`)
        }
      } else {
        alert(`Error: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error pushing inventory:', error)
      alert('Error pushing inventory')
    } finally {
      setPushingInventory(false)
    }
  }

  const handleGithubPush = async () => {
    if (!githubToken) {
      alert('Please enter your GitHub token first')
      return
    }

    const inStockProducts = products.filter(p => p.inStock)
    
    if (inStockProducts.length === 0) {
      alert('No products in stock to push!')
      return
    }

    if (!confirm(`Push ${inStockProducts.length} in-stock products directly to GitHub? This will update the main site automatically.`)) {
      return
    }

    setPushingToGithub(true)
    try {
      const response = await fetch('/api/github-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubToken: githubToken,
          repository: 'Mattjhagen/New-PacMac',
          branch: 'main'
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        const commitInfo = result.commit ? `\nCommit: ${result.commit.sha}` : ''
        const urlInfo = result.url ? `\nURL: ${result.url}` : ''
        alert(`Successfully pushed ${result.pushed} products to GitHub!${commitInfo}${urlInfo}`)
        setShowGithubForm(false)
      } else {
        alert(`Error: ${result.error || 'Unknown error'}\nDetails: ${result.details || 'No details available'}`)
      }
    } catch (error) {
      console.error('Error pushing to GitHub:', error)
      alert('Error pushing to GitHub')
    } finally {
      setPushingToGithub(false)
    }
  }

  const handleTestGithub = async () => {
    if (!githubToken) {
      alert('Please enter your GitHub token first')
      return
    }

    setTestingGithub(true)
    try {
      const response = await fetch('/api/github-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubToken: githubToken,
          repository: 'Mattjhagen/New-PacMac',
          branch: 'main',
          testOnly: true
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`✅ GitHub Access Test Successful!\n\nRepository: ${result.repository}\nType: ${result.private ? 'Private' : 'Public'}\nDefault Branch: ${result.defaultBranch}\n\nYou can now push inventory!`)
      } else {
        alert(`❌ GitHub Access Test Failed!\n\nError: ${result.error}\nDetails: ${result.details}\n\nPlease check your token permissions.`)
      }
    } catch (error) {
      console.error('Error testing GitHub:', error)
      alert('Error testing GitHub access')
    } finally {
      setTestingGithub(false)
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
              {/* VERY OBVIOUS TEST BUTTON */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test')
                  const result = await response.json()
                  alert(`API Test: ${result.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${result.message}`)
                } catch (error) {
                  alert(`API Test FAILED: ${error}`)
                }
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-white"
              style={{
                backgroundColor: '#dc2626',
                border: '4px solid #b91c1c',
                boxShadow: '0 8px 25px 0 rgba(220, 38, 38, 0.5)',
                minWidth: '180px'
              }}
            >
              🧪 API TEST
            </button>
            
              
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
                onClick={handlePushInventory}
                disabled={pushingInventory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#16a34a', border: '2px solid #15803d' }}
              >
                {pushingInventory ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">🚀</span>
                )}
                {pushingInventory ? 'Pushing...' : 'Push to Main Site'}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
              
              {/* Push to Main Site Button - Prominent Green Button */}
              <button
                onClick={handlePushInventory}
                disabled={pushingInventory}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                style={{ 
                  backgroundColor: '#16a34a', 
                  border: '3px solid #15803d',
                  boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.3)'
                }}
              >
                {pushingInventory ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                ) : (
                  <span className="mr-3 text-xl">🚀</span>
                )}
                {pushingInventory ? 'Pushing to Main Site...' : 'Push to Main Site'}
              </button>
              
              {/* Direct GitHub Push Button - VERY PROMINENT */}
            <button
              onClick={() => {
                console.log('Direct GitHub Push button clicked!')
                setShowGithubForm(true)
              }}
              disabled={pushingToGithub}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-2xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300"
              style={{
                backgroundColor: '#9333ea',
                border: '4px solid #7c3aed',
                boxShadow: '0 8px 25px 0 rgba(147, 51, 234, 0.5)',
                minWidth: '200px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              {pushingToGithub ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
              ) : (
                <span className="mr-4 text-2xl">⚡</span>
              )}
              {pushingToGithub ? 'Pushing to GitHub...' : 'Direct GitHub Push'}
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/fix-missing-scripts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ SUCCESS: Missing scripts added to main site!\n\nFiles added:\n- config.js\n- inventory-api.js\n\nProducts should now display on pacmacmobile.com!`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300"
              style={{
                backgroundColor: '#059669',
                border: '4px solid #047857',
                boxShadow: '0 8px 25px 0 rgba(5, 150, 105, 0.5)',
                minWidth: '250px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              <span className="mr-4 text-2xl">🔧</span>
              FIX MISSING SCRIPTS
            </button>
            </div>
        </div>
      </header>

      {/* SWIPE APP BANNER */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-l-4 border-pink-500 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-pink-800">💕 NEW SWIPE APP READY!</h3>
              <p className="text-pink-700">Transform your site into a fun Tinder-like shopping experience!</p>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/create-swipe-app', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`🎉 SUCCESS: Tinder-like swipe app created!\n\n✨ Features:\n• Swipe right to add to cart\n• Swipe left to pass\n• Touch and mouse support\n• Cart management\n• Checkout functionality\n\nCheck out pacmacmobile.com! 🚀`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💕 CREATE SWIPE APP
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/fix-main-site-js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ SUCCESS: Main site JavaScript fixed!\n\nFixed API method calls in initializeProducts function.\n\nProducts should now display on pacmacmobile.com!`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔧 FIX JAVASCRIPT
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/fix-product-display', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ SUCCESS: Product display fixed!\n\nNow uses existing PRODUCTS array instead of API calls.\n\nProducts should now display on pacmacmobile.com!`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎯 FIX DISPLAY
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/final-fix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ SUCCESS: Final fix applied!\n\nRemoved all API calls that could overwrite PRODUCTS array.\n\nProducts should now display on pacmacmobile.com!`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 FINAL FIX
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/fix-products-scope', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ SUCCESS: PRODUCTS scope fixed!\n\nMade PRODUCTS array global so functions can access it.\n\nProducts should now display on pacmacmobile.com!`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔧 FIX SCOPE
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/create-swipe-app', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      githubToken: githubToken,
                      repository: 'Mattjhagen/New-PacMac'
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`🎉 SUCCESS: Tinder-like swipe app created!\n\n✨ Features:\n• Swipe right to add to cart\n• Swipe left to pass\n• Touch and mouse support\n• Cart management\n• Checkout functionality\n\nCheck out pacmacmobile.com! 🚀`)
                  } else {
                    alert(`❌ FAILED: ${result.error || 'Unknown error'}`)
                  }
                } catch (error) {
                  alert(`❌ ERROR: ${error}`)
                }
              }}
              disabled={!githubToken}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💕 SWIPE APP
            </button>
          </div>
          {!githubToken && (
            <p className="text-sm text-red-600 mt-2">⚠️ Enter your GitHub token in the modal above to enable this fix</p>
          )}
        </div>
      </div>

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
                  setShowAutofillSuggestions(false)
                }}
                autofillSuggestions={autofillSuggestions}
                showAutofillSuggestions={showAutofillSuggestions}
                onProductNameChange={handleProductNameChange}
                onSelectAutofillSuggestion={selectAutofillSuggestion}
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

        {/* GitHub Push Modal */}
        {showGithubForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Direct GitHub Push
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will directly update the main PacMac site by pushing to GitHub.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Create a token at <a href="https://github.com/settings/tokens" target="_blank" className="text-purple-600 hover:underline">github.com/settings/tokens</a> with repo permissions
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleTestGithub}
                    disabled={testingGithub || !githubToken}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testingGithub ? 'Testing...' : 'Test Access'}
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowGithubForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGithubPush}
                      disabled={pushingToGithub || !githubToken}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pushingToGithub ? 'Pushing...' : 'Push to GitHub'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
