#!/bin/bash

# Deployment script for admin.pacmacmobile.com
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for deployment to admin.pacmacmobile.com"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel: https://vercel.com"
    echo "2. Set up environment variables"
    echo "3. Configure custom domain: admin.pacmacmobile.com"
    echo "4. Set up database (PostgreSQL recommended)"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
