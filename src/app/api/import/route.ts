import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { fetchProductImage } from '@/lib/imageFetcher'
import { fetchPhoneSpecs, generateDescriptionFromSpecs } from '@/lib/specsFetcher'

interface ImportProduct {
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
  sku?: string
  color?: string
  storage?: string
}

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  products: ImportProduct[]
}

// Function to fetch product image from OEM websites (now using the dedicated service)
async function getProductImage(brand: string, model: string, productName?: string): Promise<string | null> {
  return await fetchProductImage(brand, model, productName)
}

// Function to map wesellcellular data to our product schema
function mapWesellCellularData(row: any): ImportProduct {
  // Common field mappings for wesellcellular
  const brand = row.Brand || row.brand || row.Manufacturer || row.manufacturer || ''
  const model = row.Model || row.model || row.Product_Name || row.product_name || ''
  const name = row.Product_Name || row.product_name || row.Name || row.name || `${brand} ${model}`
  const price = parseFloat(row.Price || row.price || row.Cost || row.cost || '0')
  const stockCount = parseInt(row.Stock || row.stock || row.Quantity || row.quantity || '0')
  const sku = row.SKU || row.sku || row.Item_Code || row.item_code || ''
  const color = row.Color || row.color || ''
  const storage = row.Storage || row.storage || row.Capacity || row.capacity || ''

  // Build specs object
  const specs: any = {}
  if (row.Display) specs.display = row.Display
  if (row.Processor) specs.processor = row.Processor
  if (row.Memory) specs.memory = row.Memory
  if (row.Camera) specs.camera = row.Camera
  if (row.Battery) specs.battery = row.Battery
  if (row.OS) specs.os = row.OS
  if (storage) specs.storage = storage

  return {
    name: name.trim(),
    brand: brand.trim(),
    model: model.trim(),
    price,
    description: row.Description || row.description || '',
    imageUrl: row.Image_URL || row.image_url || '',
    specs: Object.keys(specs).length > 0 ? specs : undefined,
    inStock: stockCount > 0,
    stockCount,
    category: 'phone',
    sku,
    color,
    storage
  }
}

// Function to parse CSV data
function parseCSV(csvContent: string): any[] {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  })
  
  if (result.errors.length > 0) {
    throw new Error(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`)
  }
  
  return result.data
}

// Function to parse Excel data
function parseExcel(buffer: Buffer): any[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(worksheet)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fetchImages = formData.get('fetchImages') === 'true'
    const fetchSpecs = formData.get('fetchSpecs') === 'true'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let rawData: any[] = []
    
    // Parse file based on extension
    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.csv')) {
      rawData = parseCSV(buffer.toString('utf-8'))
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      rawData = parseExcel(buffer)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload CSV or Excel files.' },
        { status: 400 }
      )
    }

    if (rawData.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      success: true,
      imported: 0,
      errors: [],
      products: []
    }

    // Process each row
    for (let i = 0; i < rawData.length; i++) {
      try {
        const row = rawData[i]
        const product = mapWesellCellularData(row)
        
        // Validate required fields - only check for essential data
        if (!product.brand || !product.model || product.price <= 0) {
          result.errors.push(`Row ${i + 1}: Missing required fields (brand, model, price)`)
          continue
        }

        // Generate name if not provided
        if (!product.name) {
          product.name = `${product.brand} ${product.model}`
        }

        // Fetch image if requested and not provided
        if (fetchImages && !product.imageUrl) {
          product.imageUrl = await getProductImage(product.brand, product.model, product.name) || undefined
        }

        // Fetch specifications if requested and missing
        if (fetchSpecs) {
          const hasMissingSpecs = !product.specs || Object.keys(product.specs).length === 0
          if (hasMissingSpecs || !product.description) {
            try {
              const fetchedSpecs = await fetchPhoneSpecs(product.brand, product.model, product.specs || {})
              
              // Merge with existing specs
              product.specs = { ...product.specs, ...fetchedSpecs }
              
              // Generate description if missing
              if (!product.description) {
                product.description = generateDescriptionFromSpecs(product.specs, product.brand, product.model)
              }
            } catch (error) {
              console.log(`Failed to fetch specs for ${product.brand} ${product.model}:`, error)
            }
          }
        }

        // Check if product already exists (by name and brand)
        const existingProduct = await prisma.product.findFirst({
          where: {
            name: product.name,
            brand: product.brand
          }
        })

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              price: product.price,
              description: product.description,
              imageUrl: product.imageUrl,
              specs: product.specs,
              inStock: product.inStock,
              stockCount: product.stockCount
            }
          })
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              name: product.name,
              brand: product.brand,
              model: product.model,
              price: product.price,
              description: product.description,
              imageUrl: product.imageUrl,
              specs: product.specs,
              inStock: product.inStock,
              stockCount: product.stockCount,
              category: product.category
            }
          })
        }

        result.imported++
        result.products.push(product)
        
      } catch (error) {
        result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    )
  }
}
