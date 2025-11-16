# Cloudflare Pages Deployment Guide

This guide will help you deploy your static Astro site to Cloudflare Pages.

## Prerequisites

- Cloudflare account (already set up ✅)
- GitHub repository: `https://github.com/AnonymousWalker/mobile-mechanic`

## Deployment Methods

### Method 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Cloudflare Pages deployment"
   git push origin dev
   ```

2. **Go to Cloudflare Dashboard**:
   - Navigate to: https://dash.cloudflare.com/
   - Go to **Workers & Pages** → **Overview**
   - Click **Create application**
   - Select the **Pages** tab
   - Click **Connect to Git**

3. **Connect your repository**:
   - Select your GitHub account
   - Choose the repository: `AnonymousWalker/mobile-mechanic`
   - Click **Begin setup**

4. **Configure build settings**:
   - **Project name**: `josephmm`
   - **Production branch**: `dev` (or `main` if you prefer)
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build` (or `npm run build`)
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave as default)
   - **Deploy command**: Set to `true` (if the field is required - this is a no-op command)
   - **Non-production branch deploy command**: Set to `true` (if the field is required)

5. **Click "Save and Deploy"**

6. **Update your site URL** in `astro.config.mjs`:
   - After deployment, Cloudflare will provide you with a URL like: `https://josephmm.pages.dev`
   - Update the `site` field in `astro.config.mjs` with your actual Cloudflare Pages URL

### Method 2: Deploy via Wrangler CLI

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   pnpm add -D wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Build your site**:
   ```bash
   pnpm build
   ```

4. **Deploy to Cloudflare Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name=josephmm
   ```

## Custom Domain Setup

1. In Cloudflare Dashboard, go to your Pages project
2. Click on **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

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
- **404 errors**: Ensure `dist` is set as the build output directory
- **Assets not loading**: Verify the `site` URL in `astro.config.mjs` matches your Cloudflare Pages URL
- **"wrangler: not found" error**: 
  - Go to your Pages project settings in Cloudflare Dashboard
  - Navigate to **Settings** → **Builds & deployments** → **Build configuration**
  - Change **Deploy command** from `npx wrangler deploy` to `true`
  - Change **Non-production branch deploy command** from `npx wrangler versions upload` to `true`
  - The `true` command is a no-op that always succeeds - Cloudflare Pages automatically deploys static files from the build output directory

- **Seeing "Hello world" page instead of your site**:
  - **Check the domain**: Cloudflare Pages uses `*.pages.dev` domains, NOT `*.workers.dev`. If you're visiting a `workers.dev` domain, you're looking at a Workers project, not Pages.
  - **Verify project type**: In Cloudflare Dashboard, go to **Workers & Pages** → **Overview**. Make sure your project is listed under **Pages**, not **Workers**.
  - **Check build output directory**: In your Pages project settings → **Builds & deployments** → **Build configuration**, ensure **Build output directory** is set to `dist` (not empty).
  - **Verify build succeeded**: Check the deployment logs to ensure the build completed successfully and files were generated in the `dist` directory.
  - **If project is Workers instead of Pages**: You need to create a new **Pages** project (not Workers). Go to **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**.

