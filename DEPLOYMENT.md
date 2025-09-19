# 🚀 Deployment Guide

## 🔒 Security Setup (IMPORTANT!)

**Your API keys are now secure!** ✅
- Environment variables are properly configured
- Hardcoded keys have been removed from source code
- `.env.local` file is gitignored and won't be committed

## Environment Variables Needed

Before deploying, you'll need these environment variables from your Supabase project:

### Required Variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Get These:
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" and "anon public" key
4. Add these to your deployment platform's environment variables

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect via GitHub:
# 1. Push code to GitHub
# 2. Go to vercel.com
# 3. Import your repository
# 4. Add environment variables in dashboard
```

### 2. Netlify
```bash
# Build the app
npm run build

# Deploy via CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Or drag & drop the 'dist' folder to netlify.com
```

### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/throttle-board",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Supabase RLS policies are configured
- [ ] Database schema is up to date
- [ ] Custom domain is configured (optional)
- [ ] SSL certificate is working
- [ ] Test all functionality:
  - [ ] Flight submission
  - [ ] Admin login
  - [ ] Flight management
  - [ ] Password reset

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your domain is added to Supabase allowed origins
2. **Environment variables**: Double-check they're set correctly
3. **Build errors**: Run `npm run build` locally first to test
4. **Database connection**: Verify Supabase URL and key are correct

### Supabase Configuration:
1. Go to Supabase Dashboard → Settings → API
2. Add your deployed domain to "Site URL"
3. Add your domain to "Additional redirect URLs" if needed
4. Check RLS policies are enabled
