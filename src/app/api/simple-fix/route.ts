import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { githubToken, repository } = await request.json()

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

    console.log('Applying simple fix for repository:', repository)

    // Get the current index.html
    const getFileResponse = await fetch(`https://api.github.com/repos/${repository}/contents/index.html`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!getFileResponse.ok) {
      const errorData = await getFileResponse.json().catch(() => ({}))
      throw new Error(`Failed to fetch index.html: ${getFileResponse.status} - ${errorData.message || 'Unknown error'}`)
    }

    const fileData = await getFileResponse.json()
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')

    // Extract the PRODUCTS array from the current content
    const productsMatch = currentContent.match(/(?:const|let|var|window\.)\s*PRODUCTS\s*=\s*\[[\s\S]*?\];/);
    let products = [];
    
    if (productsMatch) {
      const productsArray = productsMatch[0].match(/\[[\s\S]*\]/);
      if (productsArray) {
        try {
          products = JSON.parse(productsArray[0]);
        } catch (e) {
          console.error('Error parsing products:', e);
        }
      }
    }

    // Create simple HTML for products (TypeScript fix applied)
    let productsHTML = '';
    if (products.length > 0) {
      productsHTML = products.map((product: any) => `
        <article class="card">
          <div class="card-front">
            <div class="flip-indicator">Click to see specs</div>
            <div class="img" aria-hidden="true">
              <img src="${product.img || '/images/no-image.png'}" alt="${product.name}" style="max-width:100%; height:auto; border-radius:8px;" />
            </div>
            <h3>${product.name}</h3>
            <p style="color:var(--muted); font-size:14px; margin:0 14px 8px;">${product.description || ''}</p>
            <p>${(product.tags || []).map(tag => `<span class="chip">${tag}</span>`).join(' ')}</p>
            <div class="price-row">
              <div><strong>$${product.price || 0}</strong></div>
              <div style="display: flex; gap: 8px;">
                <button class="btn" style="background: var(--accent-2); color: #000; font-size: 12px; padding: 8px 12px;">Trade In</button>
                <button class="btn" data-id="${product.id}">Add to Cart</button>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }

    // Replace the product-grid content with the actual products
    const fixedContent = currentContent.replace(
      /<div class="grid" id="product-grid" role="list"><\/div>/g,
      `<div class="grid" id="product-grid" role="list">${productsHTML}</div>`
    )

    // Also add a simple script to ensure products are visible
    const finalContent = fixedContent.replace(
      /<\/body>/g,
      `<script>
        // Simple fix to ensure products are visible
        document.addEventListener('DOMContentLoaded', function() {
          const productGrid = document.getElementById('product-grid');
          if (productGrid) {
            productGrid.style.display = 'grid';
            console.log('✅ Product grid made visible');
          }
        });
      </script>
      </body>`
    )

    // Update the file
    const updateFileResponse = await fetch(`https://api.github.com/repos/${repository}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Simple fix - put products directly in HTML and make grid visible',
        content: Buffer.from(finalContent).toString('base64'),
        sha: fileData.sha
      })
    })

    if (!updateFileResponse.ok) {
      const errorData = await updateFileResponse.json().catch(() => ({}))
      throw new Error(`Failed to update index.html: ${updateFileResponse.status} - ${errorData.message || 'Unknown error'}`)
    }

    const result = await updateFileResponse.json()

    return NextResponse.json({
      success: true,
      message: `Successfully applied simple fix - put ${products.length} products directly in HTML`,
      result: result,
      details: {
        repository: repository,
        changes: 'Put products directly in HTML and made grid visible',
        productsCount: products.length
      }
    })

  } catch (error) {
    console.error('Error applying simple fix:', error)
    return NextResponse.json(
      { 
        error: 'Failed to apply simple fix',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
