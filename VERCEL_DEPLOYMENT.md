# Vercel Deployment Guide

## Environment Variables Setup

Your app is failing on Vercel because the environment variables are not configured. Here's how to fix it:

### 1. Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
Name: VITE_IMDB_APP_API_KEY
Value: 2e8b6be7ebee565f43dd82741f433c6f
Environment: Production, Preview, Development
```

```
Name: VITE_FASTAPI_URL
Value: http://localhost:8000
Environment: Production, Preview, Development
```

### 2. Alternative: Using Vercel CLI

If you have Vercel CLI installed, you can set environment variables from terminal:

```bash
vercel env add VITE_IMDB_APP_API_KEY
# Enter: 2e8b6be7ebee565f43dd82741f433c6f
# Select: Production, Preview, Development

vercel env add VITE_FASTAPI_URL
# Enter: http://localhost:8000
# Select: Production, Preview, Development
```

### 3. Redeploy Your App

After setting the environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or push a new commit to trigger automatic deployment.

### 4. Verify Environment Variables

The app now includes debugging logs. Check your browser console on the deployed site to see:
- Whether the API key is being loaded correctly
- What errors occur during API calls

## Common Issues

### Issue: API Key Still Undefined
**Solution**: Make sure the environment variable name exactly matches `VITE_IMDB_APP_API_KEY` (case-sensitive)

### Issue: CORS Errors in Production
**Solution**: The TMDB API should work fine in production. If you see CORS errors, it might be a temporary network issue.

### Issue: 401 Unauthorized
**Solution**: Double-check that your TMDB API key is valid and hasn't expired.

## Testing

1. Deploy your app
2. Open browser developer console
3. Look for the environment check logs
4. Verify the API calls are working

## Need Help?

If you're still seeing issues:
1. Check the browser console for detailed error messages
2. Verify the environment variables are set correctly in Vercel dashboard
3. Make sure you've redeployed after setting the variables
