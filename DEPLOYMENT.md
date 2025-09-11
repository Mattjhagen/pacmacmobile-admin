# Deployment Guide - Admin Portal

This guide covers deploying the admin portal to `admin.pacmacmobile.com`.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications with automatic deployments from Git.

#### Steps:
1. **Push to GitHub/GitLab**
   ```bash
   git remote add origin https://github.com/yourusername/admin-pacmacmobile.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set custom domain: `admin.pacmacmobile.com`
   - Configure environment variables (see below)

3. **Configure Domain**
   - Add CNAME record: `admin.pacmacmobile.com` → `cname.vercel-dns.com`
   - Or use Vercel's domain configuration

### Option 2: Netlify

#### Steps:
1. **Build Configuration**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.x`

2. **Deploy**
   - Connect your Git repository
   - Set custom domain: `admin.pacmacmobile.com`
   - Configure environment variables

### Option 3: Self-Hosted (VPS/Server)

#### Prerequisites:
- Node.js 18+
- PostgreSQL (recommended) or SQLite
- Nginx (for reverse proxy)
- SSL certificate

#### Steps:
1. **Server Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Build the application
   npm run build
   
   # Set up database
   npm run db:push
   
   # Start the application
   npm start
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name admin.pacmacmobile.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Environment Variables

### Required Variables:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/admin_pacmacmobile"

# Next.js
NEXTAUTH_URL="https://admin.pacmacmobile.com"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Optional Variables:
```bash
# Enhanced image fetching
GOOGLE_SEARCH_API_KEY="your-google-api-key"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"

# Stock photo APIs
UNSPLASH_ACCESS_KEY="your-unsplash-key"
PEXELS_API_KEY="your-pexels-key"
```

## 🗄️ Database Setup

### For Production (Recommended):
Use PostgreSQL instead of SQLite for better performance and reliability.

1. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Deploy Database**
   ```bash
   npm run db:push
   ```

### For Vercel:
- Use Vercel Postgres addon
- Or external PostgreSQL service (Supabase, PlanetScale, etc.)

## 🔒 Security Considerations

### Production Checklist:
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS headers
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting for API endpoints
- [ ] Set up monitoring and logging

### Authentication (Future Enhancement):
Consider adding authentication for production:
```bash
npm install next-auth
```

## 📊 Monitoring & Analytics

### Recommended Tools:
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Uptime monitoring** - Service availability

## 🔄 CI/CD Pipeline

### GitHub Actions Example:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run db:migrate
      # Deploy to your hosting platform
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Ensure proper permissions

3. **Image Loading Issues**
   - Check image domain configuration in `next.config.js`
   - Verify CORS settings
   - Test image URLs manually

4. **Import Functionality Issues**
   - Check file size limits
   - Verify API timeout settings
   - Monitor server resources

## 📞 Support

For deployment issues:
1. Check the logs in your hosting platform
2. Verify environment variables
3. Test locally with production settings
4. Check domain DNS configuration

## 🔄 Updates & Maintenance

### Regular Tasks:
- [ ] Update dependencies monthly
- [ ] Monitor performance metrics
- [ ] Backup database regularly
- [ ] Review security updates
- [ ] Test import functionality
- [ ] Monitor error logs

### Version Updates:
```bash
# Update dependencies
npm update

# Test locally
npm run dev

# Deploy to staging first
# Then deploy to production
```
# Deployment triggered Wed Sep 10 23:59:05 CDT 2025
