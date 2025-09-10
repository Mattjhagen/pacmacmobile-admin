# PacMac Products Integration Guide

This guide shows how to integrate products from your admin portal (`admin.pacmacmobile.com`) with your main website (`pacmacmobile.com`).

## 🚀 Quick Start

### 1. Add the Integration Scripts to Your Main Website

Add these lines to your main website's HTML:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://admin.pacmacmobile.com/pacmac-products.css">

<!-- Include the JavaScript -->
<script src="https://admin.pacmacmobile.com/pacmac-products.js"></script>
```

### 2. Add Product Containers

Add containers where you want products to appear:

```html
<!-- Featured Products Section -->
<div class="pacmac-products-container" data-max-products="6" data-layout="grid"></div>

<!-- All Products Section -->
<div class="pacmac-products-container" data-max-products="12" data-layout="grid"></div>

<!-- Mobile Products List -->
<div class="pacmac-products-container" data-max-products="8" data-layout="list"></div>
```

### 3. Initialize the Integration

```javascript
// Basic initialization
PacMacProducts.init();

// Or with custom options
PacMacProducts.init({
    adminUrl: 'https://admin.pacmacmobile.com',
    maxProducts: 20,
    layout: 'grid'
});
```

## 📋 Configuration Options

### Container Attributes

- `data-max-products="6"` - Maximum number of products to show
- `data-layout="grid"` - Layout type: `grid` or `list`

### JavaScript Options

```javascript
PacMacProducts.init({
    adminUrl: 'https://admin.pacmacmobile.com',     // Admin portal URL
    containerSelector: '.pacmac-products-container', // CSS selector for containers
    maxProducts: 12,                                // Maximum products to fetch
    layout: 'grid'                                  // Default layout: 'grid' or 'list'
});
```

## 🎨 Styling

The integration includes responsive CSS that works with your existing design. You can customize the styles by overriding the CSS classes:

```css
/* Customize product cards */
.pacmac-product-card {
    border-radius: 16px; /* More rounded corners */
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Different shadow */
}

/* Customize colors */
.pacmac-product-price {
    color: #ff6b35; /* Orange price color */
}

.pacmac-stock-badge.in-stock {
    background: #e8f5e8; /* Light green background */
    color: #2d5a2d; /* Dark green text */
}
```

## 🔧 Event Handling

### Product Click Events

```javascript
// Listen for product clicks
document.addEventListener('pacmacProductClick', function(event) {
    const { product, productId } = event.detail;
    
    // Handle the click (show modal, add to cart, navigate, etc.)
    console.log('Product clicked:', product);
    
    // Example: Show product details
    showProductDetails(product);
    
    // Example: Add to cart
    addToCart(product);
});
```

### Manual Product Access

```javascript
// Get all products
const products = PacMacProducts.getProducts();

// Get specific product
const product = PacMacProducts.getProduct('product-id');

// Refresh products
PacMacProducts.refresh();
```

## 📱 Responsive Design

The integration is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The grid automatically adjusts based on screen size:
- Desktop: 3-4 columns
- Tablet: 2 columns  
- Mobile: 1 column

## 🔄 Real-time Updates

Products are automatically updated when:
- New products are added in the admin portal
- Product information is modified
- Stock levels change

The integration caches products for 5 minutes to improve performance.

## 🛠️ Customization Examples

### Custom Product Card Layout

```javascript
// Override the product card HTML generation
const originalGetProductCardHTML = PacMacProducts.getProductCardHTML;
PacMacProducts.getProductCardHTML = function(product) {
    // Your custom HTML here
    return `<div class="my-custom-card">...</div>`;
};
```

### Custom Click Handling

```javascript
// Override the click handler
PacMacProducts.handleProductClick = function(productId) {
    const product = this.getProduct(productId);
    
    // Your custom logic
    if (product.stockCount > 0) {
        addToCart(product);
    } else {
        showOutOfStockMessage();
    }
};
```

## 🚨 Error Handling

The integration includes built-in error handling:

- **Network errors**: Shows retry button
- **No products**: Shows "No Products Available" message
- **Invalid data**: Gracefully handles malformed responses

## 📊 Performance

- Products are cached for 5 minutes
- Images are lazy-loaded
- Only visible products are rendered
- Minimal JavaScript footprint (~15KB)

## 🔒 Security

- CORS headers are properly configured
- Only public product data is exposed
- No sensitive information is transmitted

## 🧪 Testing

### Local Testing

1. Start your admin portal: `npm run dev`
2. Update the admin URL in your main website:
   ```javascript
   PacMacProducts.init({
       adminUrl: 'http://localhost:3000'
   });
   ```

### Production Testing

1. Deploy your admin portal to `admin.pacmacmobile.com`
2. Test the integration on your main website
3. Verify products appear correctly
4. Test product clicks and interactions

## 📞 Support

If you need help with the integration:

1. Check the browser console for errors
2. Verify the admin portal is accessible
3. Ensure CORS is properly configured
4. Test with a simple container first

## 🔄 Updates

To update the integration:

1. The JavaScript and CSS files are automatically updated
2. Clear your browser cache if needed
3. No changes needed to your main website code

---

**Note**: Make sure your admin portal is deployed and accessible at `https://admin.pacmacmobile.com` before testing the integration.
