import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
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

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        model,
        price: parseFloat(price),
        description,
        imageUrl,
        specs: specs ? JSON.parse(specs) : null,
        inStock: inStock ?? true,
        stockCount: stockCount ? parseInt(stockCount) : 0,
        category: category || 'phone'
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
