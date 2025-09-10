# PacMac Mobile - Admin Portal with Autofill Integration

A comprehensive admin portal for phone inventory management with intelligent autofill capabilities, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✨ Smart Autofill System
- **Product Name Suggestions**: Real-time autocomplete with 30+ pre-configured device names
- **Auto-Generated Product IDs**: Intelligent ID generation based on product names
- **Smart Category Detection**: Automatic categorization based on product type
- **Auto-Pricing Engine**: Dynamic pricing based on device specifications and market data
- **Specification Extraction**: Automatic parsing of storage, color, condition, and carrier info
- **Tag Generation**: Intelligent tag creation based on product attributes

### 📱 Product Templates
Quick-start templates for common device types:
- **iPhone**: iPhone 15 Pro Max, iPhone 14 Pro, etc.
- **iPad**: iPad Air, iPad Pro, iPad mini variants
- **Apple Watch**: Series 10, Series 9, SE models
- **Samsung Galaxy**: S25 Ultra, S25+, Z Fold/Flip series
- **Accessories**: Charging pads, cases, cables
- **Refurbished**: Certified refurbished devices with warranty info

### 📊 Bulk Import with Autofill
- **CSV/Excel Support**: Import from wholesaler spreadsheets
- **Smart Field Mapping**: Automatic column mapping and data extraction
- **Autofill Missing Data**: Fill in gaps using intelligent algorithms
- **Preview Before Import**: Review and confirm before adding to inventory
- **22% Markup Application**: Automatic pricing with business markup

### 🔗 Direct Ecommerce Integration
- **One-Click Push**: Send products directly to main ecommerce site
- **Code Generation**: Generate ready-to-use JavaScript product arrays
- **GitHub Integration**: Direct links to edit files on GitHub
- **Copy-to-Clipboard**: Easy code copying for manual integration
- **Integration Window**: Dedicated window with step-by-step instructions

### 🛠️ Core Admin Features
- ✅ **Product Management**: Add, edit, and delete phone products
- ✅ **Phone Specifications**: Detailed specs including display, processor, memory, storage, camera, battery, and OS
- ✅ **Inventory Tracking**: Stock count and availability status
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Modern UI**: Clean, professional interface with Tailwind CSS
- ✅ **Database Integration**: SQLite database with Prisma ORM

## 🛠️ How to Use

### 1. Quick Product Entry
1. Click on a template button (iPhone, iPad, etc.)
2. Modify the auto-filled information as needed
3. Click "Add Product" to save

### 2. Smart Autofill
1. Start typing a product name (e.g., "iPhone 15")
2. Select from the dropdown suggestions
3. Click "Auto-Fill from Name" to populate all fields
4. Review and adjust as needed

### 3. Bulk Import
1. Prepare a CSV or Excel file with product data
2. Go to "Export/Import" tab
3. Upload your file in the "Bulk Import with Autofill" section
4. Preview the data and confirm import

### 4. Push to Ecommerce Site
1. Add products to your inventory
2. Click "Push to Main Site" or "Push All Inventory"
3. Copy the generated code
4. Follow the integration instructions to update your main site

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a New Product

1. Click the "Add Product" button in the header
2. Fill in the product details:
   - **Basic Info**: Name, brand, model, price
   - **Description**: Product description
   - **Image URL**: Link to product image
   - **Phone Specs**: Display, processor, memory, storage, camera, battery, OS
   - **Inventory**: Stock count and availability
3. Click "Add Product" to save

### Managing Products

- **View Products**: All products are displayed in a responsive grid
- **Edit Product**: Click the "Edit" button on any product card
- **Delete Product**: Click the "Delete" button and confirm
- **Stock Status**: Products show current stock status and count

### Product Specifications

The form includes comprehensive phone specifications:
- Display size and type
- Processor/CPU
- Memory (RAM)
- Storage options
- Camera specifications
- Battery life
- Operating system

## 📋 Supported File Formats

### CSV Import
Expected columns (flexible mapping):
- Product Name / Name / Title
- Price / Cost / Wholesale Price
- Description / Details
- Brand / Manufacturer
- Model / Model Number
- Color / Finish
- Storage / Capacity
- Condition / Grade

### Excel Import
- Supports .xlsx and .xls files
- Uses first worksheet automatically
- Flexible column mapping

## 🎯 Autofill Intelligence

### Product Name Recognition
The system recognizes and extracts:
- **Device Type**: iPhone, iPad, Apple Watch, Samsung Galaxy
- **Model**: 15 Pro Max, Air 11-inch, Series 10, S25 Ultra
- **Storage**: 128GB, 256GB, 512GB, 1TB
- **Color**: Natural Titanium, Space Gray, Midnight, etc.
- **Condition**: Like New, Refurbished, Good, Fair
- **Carrier**: Unlocked, Verizon, AT&T, T-Mobile

### Pricing Algorithm
- **Base Pricing**: Market-based pricing for each device type
- **Storage Adjustments**: +$100 for 256GB, +$200 for 512GB, +$400 for 1TB
- **Condition Multipliers**: 70% for Refurbished, 80% for Good, 60% for Fair
- **Business Markup**: 22% markup applied automatically

### Smart Tagging
Automatically generates relevant tags:
- Brand tags (iPhone, Samsung, etc.)
- Specification tags (256GB, Space Gray, etc.)
- Condition tags (Like New, Refurbished, etc.)
- Carrier tags (Unlocked, Verizon, etc.)

## 🔧 Integration with Main Ecommerce Site

### Direct GitHub Integration
The system provides direct links to:
- [Main Repository](https://github.com/Mattjhagen/New-PacMac)
- [Edit index.html](https://github.com/Mattjhagen/New-PacMac/blob/main/index.html)

### Generated Code Format
```javascript
const PRODUCTS = [
  {
    id: 'pm-iphone-15-pro-max-256gb-natural-titanium',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    price: 1341.78,
    tags: ['iPhone', '256GB', 'Natural Titanium', 'Like New', 'Unlocked'],
    img: 'products/placeholder.jpg',
    description: 'Premium iPhone 15 Pro Max 256GB Natural Titanium in excellent condition with full functionality and warranty.',
    specs: {
      "storage": "256GB",
      "color": "Natural Titanium",
      "condition": "Like New",
      "carrier": "Unlocked"
    }
  }
];
```

## Database Schema

The application uses a SQLite database with the following product model:

```typescript
interface Product {
  id: string
  name: string
  brand: string
  model: string
  price: number
  description?: string
  imageUrl?: string
  specs?: any // JSON object for phone specifications
  inStock: boolean
  stockCount: number
  category: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Fetch a single product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Heroicons
- **Form Handling**: React Hook Form (ready for implementation)

## 📱 Supported Devices

### Apple Products
- **iPhone**: 15 Pro Max, 15 Pro, 15 Plus, 15, 14 Pro Max, 14 Pro, 14, 13 Pro Max, 13 Pro, 13
- **iPad**: Pro 12.9", Pro 11", Air 11", Air 10.9", 10.9", mini 8.3"
- **Apple Watch**: Series 10 (45mm/41mm), Series 9 (45mm/41mm), SE (44mm/40mm)

### Samsung Products
- **Galaxy S25**: Ultra (512GB/256GB), S25+ (256GB), S25 (128GB)
- **Galaxy Z**: Fold6 (256GB), Flip6 (256GB)

### Other Brands
- **Google Pixel**: 9 Pro (256GB), 9 (128GB)
- **OnePlus**: 12 (256GB/128GB)

## 🚨 Validation & Error Handling

### Product Validation
- **Name**: Minimum 3 characters
- **ID**: Minimum 3 characters, unique within inventory
- **Price**: Must be positive number
- **Tags**: Maximum 10 tags allowed

### Error Messages
- Clear, actionable error messages
- Validation before saving
- Duplicate ID detection
- File format validation for imports

## 💾 Data Storage

### Local Storage
- All inventory data stored in browser localStorage
- Persistent across browser sessions
- Export/import functionality for backup

### Data Structure
```javascript
{
  id: 'pm-product-id',
  name: 'Product Name',
  price: 999.99,
  category: 'main|refurbished|accessory',
  description: 'Product description',
  specs: { storage: '256GB', color: 'Black' },
  tags: ['tag1', 'tag2'],
  img: 'data:image/...' or 'products/image.jpg',
  dateAdded: '2025-01-27T...'
}
```

## 🔄 Workflow Integration

### Typical Workflow
1. **Import**: Bulk import from wholesaler files
2. **Review**: Check auto-filled data and make adjustments
3. **Validate**: System validates all required fields
4. **Save**: Add to local inventory
5. **Push**: Generate code and push to main ecommerce site
6. **Deploy**: Update main site with new products

### Best Practices
- Use templates for common device types
- Leverage autofill for quick data entry
- Validate data before bulk imports
- Test integration with small batches first
- Keep inventory organized with consistent naming

## Development

### Database Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset the database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Project Structure

```
src/
├── app/
│   ├── api/products/     # API routes
│   └── page.tsx          # Main dashboard
├── components/
│   ├── ProductForm.tsx   # Product creation/editing form
│   └── ProductCard.tsx   # Product display card
└── lib/
    └── prisma.ts         # Database client
```

## Future Enhancements

- [ ] Admin authentication and security
- [ ] Bulk product import/export
- [ ] Product categories and filtering
- [ ] Image upload functionality
- [ ] Advanced search and filtering
- [ ] Product variants (colors, storage options)
- [ ] Analytics dashboard

## 🆘 Troubleshooting

### Common Issues
- **Autofill not working**: Check browser console for errors
- **Import fails**: Verify file format and column headers
- **Code generation fails**: Ensure all required fields are filled
- **Integration issues**: Check GitHub repository access

### Support
- Check browser console for detailed error messages
- Verify file formats match expected structure
- Ensure all required fields are completed
- Test with small data sets first

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Built with Code, Coffee and Jesus.** ☕✝️

*PacMac Mobile LLC - Making mobile technology accessible to everyone.*