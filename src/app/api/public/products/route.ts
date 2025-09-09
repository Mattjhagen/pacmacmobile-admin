import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/products - Public endpoint for main website to fetch products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true, // Only show products that are in stock
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        brand: true,
        model: true,
        price: true,
        description: true,
        imageUrl: true,
        specs: true,
        stockCount: true,
        category: true,
        // Don't expose internal fields like createdAt, updatedAt
      }
    })

    // Transform the data for the main website
    const publicProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      description: product.description,
      image: product.imageUrl, // Map imageUrl to image for compatibility
      imageUrl: product.imageUrl,
      specs: product.specs,
      stockCount: product.stockCount,
      category: product.category,
      // Add tags for compatibility with existing site
      tags: [
        product.brand,
        product.model,
        product.category,
        ...(product.specs?.storage ? [product.specs.storage as string] : []),
        ...(product.specs?.memory ? [product.specs.memory as string] : [])
      ].filter(Boolean)
    }))

    return NextResponse.json(publicProducts, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    })
  } catch (error) {
    console.error('Error fetching public products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}
