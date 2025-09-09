import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchMultipleProductImages } from '@/lib/imageFetcher'

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json()
    
    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      )
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        imageUrl: null // Only fetch images for products without images
      },
      select: {
        id: true,
        brand: true,
        model: true,
        name: true
      }
    })

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: 'No products found that need images'
      })
    }

    // Prepare data for image fetching
    const productsToFetch = products.map(product => ({
      brand: product.brand,
      model: product.model,
      name: product.name
    }))

    // Fetch images in batch
    const imageResults = await fetchMultipleProductImages(productsToFetch)

    // Update products with fetched images
    let updatedCount = 0
    const updatePromises = products.map(async (product) => {
      const key = `${product.brand}-${product.model}`
      const imageUrl = imageResults.get(key)
      
      if (imageUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl }
        })
        updatedCount++
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      total: products.length,
      message: `Successfully updated ${updatedCount} out of ${products.length} products with images`
    })

  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
