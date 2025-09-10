import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for products (replace with database later)
let products: any[] = []

// GET /api/products - Fetch all products
export async function GET() {
  try {
    // Return products from in-memory storage
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      brand,
      model,
      price,
      description,
      imageUrl,
      specs,
      inStock,
      stockCount,
      category
    } = body

    // Validate required fields
    if (!name || !brand || !model || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, brand, model, price' },
        { status: 400 }
      )
    }

    // Create product with in-memory storage
    const product = {
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      brand,
      model,
      price: parseFloat(price),
      description,
      imageUrl,
      specs: specs ? (typeof specs === 'string' ? JSON.parse(specs) : specs) : null,
      inStock: inStock ?? true,
      stockCount: stockCount ? parseInt(stockCount) : 0,
      category: category || 'phone',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to in-memory storage
    products.push(product)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
