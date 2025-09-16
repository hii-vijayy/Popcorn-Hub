# Environment Variables Setup Guide

## Local Development

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Replace `your_tmdb_api_key_here` with your actual TMDB API key in the `.env` file.

3. Get your TMDB API key:
   - Go to [TMDB Settings](https://www.themoviedb.org/settings/api)
   - Create an account if you don't have one
   - Request an API key
   - Copy your API key and paste it in the `.env` file

## Vercel Deployment

### Method 1: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your project or go to your existing project
3. Go to Settings → Environment Variables
4. Add the following environment variables:
   - `VITE_TMDB_API_KEY`: Your TMDB API key
   - `VITE_TMDB_BASE_URL`: `https://api.themoviedb.org/3`
   - `VITE_TMDB_IMAGE_BASE_URL`: `https://image.tmdb.org/t/p`

### Method 2: Using Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Add environment variables:

   ```bash
   vercel env add VITE_TMDB_API_KEY
   # Enter your TMDB API key when prompted

   vercel env add VITE_TMDB_BASE_URL
   # Enter: https://api.themoviedb.org/3

   vercel env add VITE_TMDB_IMAGE_BASE_URL
   # Enter: https://image.tmdb.org/t/p
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

### Method 3: Using Environment Variables in vercel.json (Deprecated)

The `vercel.json` file has been configured to reference environment variables. Make sure to set them in your Vercel dashboard.

## Security Notes

- ✅ API keys are now stored in environment variables
- ✅ `.env` file is gitignored to prevent accidental commits
- ✅ Environment variables are validated at runtime
- ✅ Clear error messages if API key is missing
- ✅ Vercel deployment configuration included

## Testing

To test that environment variables are working:

1. Remove or rename your `.env` file temporarily
2. Run `npm run dev`
3. You should see an error message about the missing API key
4. Restore your `.env` file and the error should disappear
