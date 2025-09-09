# Admin Portal - Phone Ecommerce Management

A modern admin portal built with Next.js, TypeScript, and Tailwind CSS for managing phone products in your ecommerce store.

## Features

- ✅ **Product Management**: Add, edit, and delete phone products
- ✅ **Phone Specifications**: Detailed specs including display, processor, memory, storage, camera, battery, and OS
- ✅ **Inventory Tracking**: Stock count and availability status
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Modern UI**: Clean, professional interface with Tailwind CSS
- ✅ **Database Integration**: SQLite database with Prisma ORM

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

## Future Enhancements

- [ ] Admin authentication and security
- [ ] Bulk product import/export
- [ ] Product categories and filtering
- [ ] Image upload functionality
- [ ] Advanced search and filtering
- [ ] Product variants (colors, storage options)
- [ ] Analytics dashboard

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.