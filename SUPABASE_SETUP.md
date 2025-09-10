# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Name it: `pacmacmobile-admin`
6. Set a database password (save this!)
7. Choose a region close to you
8. Click "Create new project"

## Step 2: Get Database URL

Once your project is created:
1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI)
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Set Up Environment Variables

### For Vercel (Production):
1. Go to your Vercel dashboard
2. Select your `pacmacmobile-admin` project
3. Go to **Settings** → **Environment Variables**
4. Add: `DATABASE_URL` = your Supabase connection string
5. Add: `NEXTAUTH_URL` = `https://admin.pacmacmobile.com`
6. Add: `NEXTAUTH_SECRET` = generate a secure random string

### For Local Testing:
Create a `.env.local` file with:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key-here"
```

## Step 4: Deploy Database Schema

After setting up the environment variables:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Deploy to Vercel
vercel --prod
```

## Step 5: Import Your Products

Once the database is set up:
1. Go to `https://admin.pacmacmobile.com`
2. Click "Import from wesellcellular"
3. Upload your inventory file
4. Products will be imported to Supabase

## Step 6: Test the Integration

Test the public API:
```bash
curl https://admin.pacmacmobile.com/api/public/products
```

You should see your imported products!
