import axios from 'axios'
import * as cheerio from 'cheerio'

// interface ImageSearchResult {
//   url: string
//   title: string
//   source: string
// }

// OEM website configurations
const OEM_WEBSITES = {
  apple: {
    baseUrl: 'https://www.apple.com',
    searchPath: '/search',
    imageSelectors: ['.product-image img', '.hero-image img', '.product-hero img'],
    fallbackUrls: [
      'https://store.storeimages.cdn-apple.com',
      'https://www.apple.com/v/iphone'
    ]
  },
  samsung: {
    baseUrl: 'https://www.samsung.com',
    searchPath: '/us/search',
    imageSelectors: ['.product-image img', '.hero-image img', '.product-hero img'],
    fallbackUrls: [
      'https://images.samsung.com',
      'https://www.samsung.com/us/smartphones'
    ]
  },
  google: {
    baseUrl: 'https://store.google.com',
    searchPath: '/search',
    imageSelectors: ['.product-image img', '.hero-image img', '.product-hero img'],
    fallbackUrls: [
      'https://lh3.googleusercontent.com',
      'https://store.google.com/product'
    ]
  },
  oneplus: {
    baseUrl: 'https://www.oneplus.com',
    searchPath: '/search',
    imageSelectors: ['.product-image img', '.hero-image img', '.product-hero img'],
    fallbackUrls: [
      'https://www.oneplus.com/product'
    ]
  }
}

// Generic image search using multiple strategies
export async function fetchProductImage(
  brand: string, 
  model: string, 
  productName?: string
): Promise<string | null> {
  const normalizedBrand = brand.toLowerCase().trim()
  const normalizedModel = model.toLowerCase().trim()
  
  try {
    // Strategy 1: Try OEM-specific websites
    const oemImage = await searchOEMWebsite(normalizedBrand, normalizedModel, productName)
    if (oemImage) return oemImage

    // Strategy 2: Try generic product image search
    const genericImage = await searchGenericProductImages(brand, model, productName)
    if (genericImage) return genericImage

    // Strategy 3: Try stock photo services
    const stockImage = await searchStockPhotos(brand, model)
    if (stockImage) return stockImage

    return null
  } catch (error) {
    console.error('Error fetching product image:', error)
    return null
  }
}

// Search OEM-specific websites
async function searchOEMWebsite(brand: string, model: string, productName?: string): Promise<string | null> {
  const oemConfig = OEM_WEBSITES[brand as keyof typeof OEM_WEBSITES]
  if (!oemConfig) return null

  try {
    // Try direct product page search
    const searchQueries = [
      `${brand} ${model}`,
      productName || `${brand} ${model}`,
      model
    ]

    for (const query of searchQueries) {
      try {
        const searchUrl = `${oemConfig.baseUrl}${oemConfig.searchPath}?q=${encodeURIComponent(query)}`
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000
        })

        const $ = cheerio.load(response.data)
        
        // Try different image selectors
        for (const selector of oemConfig.imageSelectors) {
          const imgElement = $(selector).first()
          const src = imgElement.attr('src') || imgElement.attr('data-src')
          
          if (src && isValidImageUrl(src)) {
            return makeAbsoluteUrl(src, oemConfig.baseUrl)
          }
        }
      } catch (error) {
        console.log(`Failed to search ${brand} website for ${model}:`, error)
        continue
      }
    }

    return null
  } catch (error) {
    console.error(`Error searching ${brand} website:`, error)
    return null
  }
}

// Search generic product images
async function searchGenericProductImages(brand: string, model: string, productName?: string): Promise<string | null> {
  const searchQueries = [
    `${brand} ${model} official product image`,
    `${brand} ${model} product photo`,
    `${brand} ${model} smartphone image`,
    productName || `${brand} ${model}`
  ]

  for (const query of searchQueries) {
    try {
      // Use a simple image search approach
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:m,itp:photo`
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      })

      const $ = cheerio.load(response.data)
      const images = $('img[src*="http"]')
      
      for (let i = 0; i < Math.min(images.length, 5); i++) {
        const imgSrc = $(images[i]).attr('src')
        if (imgSrc && isValidImageUrl(imgSrc) && !isGoogleImage(imgSrc)) {
          return imgSrc
        }
      }
    } catch (error) {
      console.log(`Failed to search generic images for ${brand} ${model}:`, error)
      continue
    }
  }

  return null
}

// Search stock photo services
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function searchStockPhotos(_brand: string, _model: string): Promise<string | null> {
  // This would typically use APIs like Unsplash, Pexels, etc.
  // For now, we'll use a simple approach with common stock photo patterns
  
  // const stockQueries = [
  //   `${brand} ${model} phone`,
  //   `${brand} smartphone`,
  //   `${model} mobile phone`
  // ]

  // In a real implementation, you would use the actual APIs
  // For now, return null as this requires API keys
  return null
}

// Utility functions
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  // Check if it's a valid image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext))
  
  // Check if it's not a data URL or placeholder
  const isNotDataUrl = !url.startsWith('data:')
  const isNotPlaceholder = !url.includes('placeholder') && !url.includes('logo')
  
  return hasImageExtension && isNotDataUrl && isNotPlaceholder
}

function isGoogleImage(url: string): boolean {
  return url.includes('googleusercontent.com') || url.includes('google.com')
}

function makeAbsoluteUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http')) return url
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `${baseUrl}${url}`
  return `${baseUrl}/${url}`
}

// Batch image fetching for multiple products
export async function fetchMultipleProductImages(
  products: Array<{ brand: string; model: string; name?: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>()
  
  // Process in batches to avoid overwhelming servers
  const batchSize = 5
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    
    const promises = batch.map(async (product, index) => {
      const key = `${product.brand}-${product.model}`
      const imageUrl = await fetchProductImage(product.brand, product.model, product.name)
      if (imageUrl) {
        results.set(key, imageUrl)
      }
      
      // Add delay between requests to be respectful
      if (index < batch.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    })
    
    await Promise.all(promises)
    
    // Add delay between batches
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  return results
}
