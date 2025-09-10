# Google OAuth Setup for index.html

## Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted

## Step 2: Configure OAuth 2.0 Client ID

**Application type:** `Web application`

**Name:** `PacMac Mobile Admin`

**Authorized JavaScript origins:**
```
https://your-domain.com
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://your-domain.com
http://localhost:3000
```

## Step 3: Update index.html

Replace `YOUR_GOOGLE_CLIENT_ID` in the `index.html` file with your actual Google OAuth Client ID:

```javascript
google.accounts.id.initialize({
    client_id: 'your-actual-google-client-id-here.apps.googleusercontent.com',
    callback: this.handleCredentialResponse.bind(this),
    auto_select: false,
    cancel_on_tap_outside: true
});
```

## Step 4: Test the Authentication

1. Open your `index.html` file in a browser
2. Click "Log in with Google"
3. Complete the Google OAuth flow
4. You should see the admin interface after successful authentication

## Features Added

- ✅ Google OAuth authentication
- ✅ User session persistence (stored in localStorage)
- ✅ Protected admin interface (hidden until authenticated)
- ✅ User info display (name, email, picture)
- ✅ Logout functionality
- ✅ Automatic re-authentication on page reload

## Security Notes

- User data is stored in localStorage (client-side only)
- No server-side authentication required
- Perfect for simple admin interfaces
- JWT tokens are handled securely by Google's SDK

## Troubleshooting

- Make sure your domain is added to authorized origins
- Check browser console for any JavaScript errors
- Ensure Google OAuth SDK is loading properly
- Verify your Client ID is correct
