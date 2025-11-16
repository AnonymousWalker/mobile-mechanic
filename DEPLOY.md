# Cloudflare Workers Deployment Guide

This guide will help you deploy your static Astro site to Cloudflare Workers with static assets.

## Prerequisites

- Cloudflare account (already set up ✅)
- GitHub repository: `https://github.com/AnonymousWalker/mobile-mechanic`

## Deployment Methods

### Method 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Cloudflare Workers deployment"
   git push origin dev
   ```

2. **Go to Cloudflare Dashboard**:
   - Navigate to: https://dash.cloudflare.com/
   - Go to **Workers & Pages** → **Overview**
   - Click **Create application**
   - Select the **Workers** tab (not Pages)
   - Click **Connect to Git**

3. **Connect your repository**:
   - Select your GitHub account
   - Choose the repository: `AnonymousWalker/mobile-mechanic`
   - Click **Begin setup**

4. **Configure build settings**:
   - **Project name**: `josephmm`
   - **Production branch**: `dev` (or `main` if you prefer)
   - **Build command**: `pnpm build`
   - **Deploy command**: `npx wrangler deploy`
   - **Non-production branch deploy command**: `npx wrangler deploy`

5. **Click "Save and Deploy"**

6. **Update your site URL** in `astro.config.mjs`:
   - After deployment, Cloudflare will provide you with a URL like: `https://josephmm.workers.dev`
   - Update the `site` field in `astro.config.mjs` with your actual Cloudflare Workers URL

### Method 2: Deploy via Wrangler CLI (Local)

1. **Login to Cloudflare** (if not already logged in):
   ```bash
   npx wrangler login
   ```

2. **Build and deploy**:
   ```bash
   pnpm deploy
   ```
   
   Or manually:
   ```bash
   pnpm build
   npx wrangler deploy
   ```

## Custom Domain Setup

1. In Cloudflare Dashboard, go to your Workers project
2. Click on **Triggers** → **Routes**
3. Click **Add route**
4. Enter your domain pattern (e.g., `yourdomain.com/*`)
5. Or add routes in `wrangler.jsonc`:
   ```jsonc
   "routes": [
     { 
       "pattern": "yourdomain.com", 
       "custom_domain": true 
     },
     { 
       "pattern": "www.yourdomain.com", 
       "custom_domain": true 
     }
   ]
   ```

## Environment Variables (if needed)

If you need environment variables:

1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add your variables for Production, Preview, or both

## Continuous Deployment

Once connected to Git, Cloudflare Pages will automatically:
- Deploy on every push to your production branch
- Create preview deployments for pull requests
- Rebuild on every commit

## Build Output

Your static site is built to the `dist/` directory, which contains:
- All HTML pages
- Static assets (CSS, JS, images)
- Sitemap files

## Troubleshooting

- **Build fails**: Check the build logs in Cloudflare Dashboard
- **404 errors**: Ensure `dist` directory exists and contains your built files after running `pnpm build`
- **Assets not loading**: Verify the `site` URL in `astro.config.mjs` matches your Cloudflare Workers URL (`https://josephmm.workers.dev`)
- **"wrangler: not found" error**: 
  - Make sure `wrangler` is installed: `pnpm add -D wrangler`
  - Or use `npx wrangler deploy` instead of just `wrangler deploy`

- **Seeing "Hello world" page instead of your site**:
  - **Verify wrangler.jsonc exists**: Make sure `wrangler.jsonc` is in the root directory with the correct `assets.directory` set to `./dist`
  - **Check worker.js**: Ensure `src/worker.js` exists and is properly configured
  - **Verify build succeeded**: Check the deployment logs to ensure the build completed successfully and files were generated in the `dist` directory
  - **Check ASSETS binding**: The worker uses `env.ASSETS` binding - make sure `wrangler.jsonc` has the assets configuration
  - **Redeploy**: After making changes to `wrangler.jsonc` or `worker.js`, rebuild and redeploy

