# PacMac Inventory Integration Guide

## Overview
This guide explains how to integrate your admin panel inventory with the main PacMac Mobile e-commerce site.

## Integration Methods

### Method 1: File Generation (Recommended)
The admin panel generates a JavaScript file that you can manually copy to the main site.

**Steps:**
1. Click "Push to Main Site" in the admin panel
2. Copy the generated code from the popup window
3. Go to [New-PacMac repository](https://github.com/Mattjhagen/New-PacMac)
4. Edit `index.html`
5. Replace the `PRODUCTS` array with the generated code
6. Commit and push changes

### Method 2: Direct API Integration (Advanced)
Set up a direct API connection between the admin panel and main site.

**Setup:**
1. Add an API endpoint to the main site to receive inventory updates
2. Configure the admin panel with the main site's API URL
3. Enable automatic inventory synchronization

## Product Format Mapping

### Admin Panel Format
```javascript
{
  id: "product_123",
  name: "iPhone 16 Pro",
  brand: "Apple",
  model: "iPhone 16 Pro",
  price: 999.00,
  description: "Latest iPhone with advanced features",
  imageUrl: "https://store.storeimages.cdn-apple.com/...",
  specs: {
    display: "6.1-inch Super Retina XDR",
    processor: "A18 Pro chip",
    memory: "8GB RAM",
    storage: "128GB",
    camera: "48MP Main, 12MP Ultra Wide",
    battery: "Up to 23 hours video playback",
    os: "iOS 18"
  },
  inStock: true,
  stockCount: 5,
  category: "phone"
}
```

### Main Site Format
```javascript
{
  id: "pm-product_123",
  name: "iPhone 16 Pro",
  price: 999.00,
  tags: ["Apple", "iPhone 16 Pro", "phone", "6.1-inch Super Retina XDR", "A18 Pro chip"],
  img: "https://store.storeimages.cdn-apple.com/...",
  description: "Latest iPhone with advanced features",
  brand: "Apple",
  model: "iPhone 16 Pro",
  specs: { /* same as admin */ },
  inStock: true,
  stockCount: 5
}
```

## Features

### Automatic Tag Generation
The system automatically generates tags from:
- Brand name
- Model name
- Category
- Spec values (display, processor, memory, etc.)

### Image URL Mapping
- Admin `imageUrl` → Main site `img`
- Fallback to placeholder if no image available

### Stock Management
- Only in-stock products are pushed to main site
- Stock counts are preserved
- Out-of-stock products are excluded

## API Endpoints

### Admin Panel
- `POST /api/push-inventory` - Push inventory to main site
- `GET /api/push-inventory` - Get inventory status

### Main Site (Optional)
- `POST /api/update-inventory` - Receive inventory updates
- `GET /api/inventory-status` - Get current inventory status

## Security Considerations

### API Keys
- Use environment variables for API keys
- Implement proper authentication
- Rate limiting for API endpoints

### Data Validation
- Validate product data before processing
- Sanitize user inputs
- Check for required fields

## Troubleshooting

### Common Issues

**Products not appearing on main site:**
- Check if products are marked as "in stock"
- Verify image URLs are accessible
- Ensure proper product format

**Images not loading:**
- Check image URL accessibility
- Verify CORS settings
- Use HTTPS URLs

**API connection fails:**
- Check network connectivity
- Verify API endpoint URLs
- Check authentication credentials

### Debug Mode
Add `?debug=true` to admin panel URL for detailed logging.

## Best Practices

### Inventory Management
1. Keep product data consistent between admin and main site
2. Regularly sync inventory to avoid discrepancies
3. Test changes on staging environment first

### Performance
1. Batch inventory updates for better performance
2. Use CDN for product images
3. Implement caching for frequently accessed data

### Monitoring
1. Set up alerts for failed inventory pushes
2. Monitor API response times
3. Track inventory synchronization success rates

## Support

For technical support or questions about inventory integration:
- **Email**: info@pacmacmobile.com
- **Phone**: 402.302.2197

---

*This integration system was built to streamline inventory management between the admin panel and main e-commerce site.*