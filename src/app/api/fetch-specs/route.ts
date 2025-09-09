import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchMultipleProductSpecs, generateDescriptionFromSpecs } from '@/lib/specsFetcher'

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
        id: { in: productIds }
      },
      select: {
        id: true,
        brand: true,
        model: true,
        name: true,
        specs: true,
        description: true
      }
    })

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: 'No products found'
      })
    }

    // Prepare data for specs fetching
    const productsToFetch = products.map(product => ({
      brand: product.brand,
      model: product.model,
      specs: product.specs as Record<string, unknown>
    }))

    // Fetch specifications in batch
    const specsResults = await fetchMultipleProductSpecs(productsToFetch)

    // Update products with fetched specifications
    let updatedCount = 0
    const updatePromises = products.map(async (product) => {
      const key = `${product.brand}-${product.model}`
      const fetchedSpecs = specsResults.get(key)
      
      if (fetchedSpecs && Object.keys(fetchedSpecs).length > 0) {
        // Merge with existing specs
        const mergedSpecs = { ...product.specs, ...fetchedSpecs }
        
        // Generate description if missing or update if specs changed significantly
        let description = product.description
        if (!description || Object.keys(fetchedSpecs).length > 2) {
          description = generateDescriptionFromSpecs(mergedSpecs, product.brand, product.model)
        }

        await prisma.product.update({
          where: { id: product.id },
          data: { 
            specs: mergedSpecs,
            description: description
          }
        })
        updatedCount++
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      total: products.length,
      message: `Successfully updated ${updatedCount} out of ${products.length} products with specifications`
    })

  } catch (error) {
    console.error('Error fetching specifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    )
  }
}
