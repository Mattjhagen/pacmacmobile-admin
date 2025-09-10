# Vercel Environment Variables Setup

## Required Environment Variables

To fix the GitHub OAuth 404 issue, you need to set these environment variables in your Vercel dashboard:

### 1. NextAuth Configuration
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://pacmacmobile-admin-git-main-matty-hagens-projects.vercel.app
```

### 2. GitHub OAuth App
```
GITHUB_ID=your-github-oauth-app-client-id
GITHUB_SECRET=your-github-oauth-app-client-secret
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (pacmacmobile-admin)
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value

## GitHub OAuth App Setup

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App or edit existing one
3. Set the following URLs:
   - **Homepage URL**: `https://pacmacmobile-admin-git-main-matty-hagens-projects.vercel.app`
   - **Authorization callback URL**: `https://pacmacmobile-admin-git-main-matty-hagens-projects.vercel.app/api/auth/callback/github`

## Generate NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## After Setting Variables

1. Redeploy your app in Vercel
2. The GitHub OAuth should now work correctly
3. After signing in, you should be redirected back to the main dashboard

## Troubleshooting

- Make sure the callback URL in GitHub OAuth app matches exactly: `https://pacmacmobile-admin-git-main-matty-hagens-projects.vercel.app/api/auth/callback/github`
- Ensure all environment variables are set in Vercel
- Check Vercel function logs for any errors
- Verify the NEXTAUTH_URL matches your deployed domain
