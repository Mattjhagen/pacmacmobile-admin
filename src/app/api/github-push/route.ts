import { NextRequest, NextResponse } from 'next/server'

// Product interface for type safety
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

// Simple in-memory storage for products (shared with other routes)
declare global {
  var __products: Product[] | undefined
}

const products = globalThis.__products ?? (globalThis.__products = [])

// Main site product format (based on PacMac site structure)
interface MainSiteProduct {
  id: string
  name: string
  price: number
  tags: string[]
  img: string
  description: string
  brand?: string
  model?: string
  specs?: Record<string, unknown>
  inStock?: boolean
  stockCount?: number
}

// POST /api/github-push - Push inventory directly to GitHub repository
export async function POST(request: NextRequest) {
  try {
    const { githubToken, repository, branch = 'main' } = await request.json()
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      )
    }

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository is required (format: owner/repo)' },
        { status: 400 }
      )
    }

    // Get all in-stock products from admin
    const inStockProducts = products.filter(product => product.inStock)
    
    if (inStockProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products to push',
        pushed: 0
      })
    }

    // Transform admin products to main site format
    const mainSiteProducts: MainSiteProduct[] = inStockProducts.map(product => {
      // Generate tags from specs and category
      const tags = [
        product.brand,
        product.model,
        product.category,
        ...(product.specs && typeof product.specs === 'object' ? 
          Object.values(product.specs).filter(val => val && typeof val === 'string').map(String) : 
          []
        )
      ].filter(Boolean)

      return {
        id: `pm-${product.id}`, // Prefix with 'pm-' for PacMac
        name: product.name,
        price: product.price,
        tags: tags,
        img: product.imageUrl || '/Products/placeholder.jpg',
        description: product.description || `${product.brand} ${product.model} - Premium mobile device`,
        brand: product.brand,
        model: product.model,
        specs: product.specs,
        inStock: product.inStock,
        stockCount: product.stockCount
      }
    })

    // Generate the new PRODUCTS array
    const productsArray = `const PRODUCTS = ${JSON.stringify(mainSiteProducts, null, 2)};`
    
    // Get current index.html from GitHub
    const getFileResponse = await fetch(`https://api.github.com/repos/${repository}/contents/index.html`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!getFileResponse.ok) {
      throw new Error(`Failed to fetch index.html: ${getFileResponse.status}`)
    }

    const fileData = await getFileResponse.json()
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
    
    // Find and replace the PRODUCTS array
    const productsRegex = /const PRODUCTS = \[[\s\S]*?\];/
    const newContent = currentContent.replace(productsRegex, productsArray)
    
    if (newContent === currentContent) {
      throw new Error('Could not find PRODUCTS array in index.html')
    }

    // Update the file on GitHub
    const updateResponse = await fetch(`https://api.github.com/repos/${repository}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update inventory from admin panel - ${mainSiteProducts.length} products`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
        branch: branch
      })
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`Failed to update GitHub: ${errorData.message}`)
    }

    const updateResult = await updateResponse.json()

    return NextResponse.json({
      success: true,
      pushed: mainSiteProducts.length,
      total: inStockProducts.length,
      message: `Successfully updated ${mainSiteProducts.length} products on GitHub`,
      commit: updateResult.commit,
      url: updateResult.content.html_url
    })

  } catch (error) {
    console.error('Error pushing to GitHub:', error)
    return NextResponse.json(
      { 
        error: 'Failed to push to GitHub', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// GET /api/github-push - Get current inventory status
export async function GET() {
  try {
    const inStockProducts = products.filter(product => product.inStock)
    const outOfStockProducts = products.filter(product => !product.inStock)
    
    return NextResponse.json({
      total: products.length,
      inStock: inStockProducts.length,
      outOfStock: outOfStockProducts.length,
      readyToPush: inStockProducts.length,
      lastUpdated: products.length > 0 ? 
        Math.max(...products.map(p => new Date(p.updatedAt).getTime())) : null,
      instructions: [
        '1. Create a GitHub Personal Access Token with repo permissions',
        '2. Use the token in the GitHub Push form',
        '3. Repository should be in format: Mattjhagen/New-PacMac',
        '4. Click Push to GitHub to update the main site automatically'
      ]
    })
  } catch (error) {
    console.error('Error getting inventory status:', error)
    return NextResponse.json(
      { error: 'Failed to get inventory status' },
      { status: 500 }
    )
  }
}
