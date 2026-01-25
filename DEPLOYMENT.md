# ConTrack Frontend - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- [ ] Vercel account (free tier works fine) - [Sign up here](https://vercel.com/signup)
- [ ] GitHub account (recommended for continuous deployment)
- [ ] Node.js 18+ installed locally (for testing builds)

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
cd d:\hackathon\frontend\contrack

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial ConTrack frontend for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/contrack-frontend.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `contrack-frontend` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables (if needed)
If you're using any API keys (like the Gemini API key referenced in vite.config.ts):
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key
   - **Environment**: Production, Preview, Development

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd d:\hackathon\frontend\contrack

# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? contrack (or your choice)
# - Directory? ./ (just press Enter)
# - Override build settings? No

# For production deployment:
vercel --prod
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [x] **index.css exists** - ✅ Created
- [x] **vercel.json configured** - ✅ Created
- [x] **.vercelignore added** - ✅ Created
- [ ] **Build works locally** - Run `npm run build` to verify
- [ ] **No TypeScript errors** - Run `npm run build` (Vite will report errors)
- [ ] **Environment variables set** (if using external APIs)

---

## 🧪 Test Build Locally (Optional but Recommended)

Before deploying, test the production build:

```bash
# Navigate to project
cd d:\hackathon\frontend\contrack

# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Preview the production build
npm run preview
```

If the build succeeds and preview works, you're ready to deploy!

---

## 🎨 What Gets Deployed

Your deployment will include:
- ✅ Landing page with Hero, Features, Testimonials
- ✅ Login/Authentication flow
- ✅ Client Dashboard (white theme, green accents)
- ✅ Vendor Dashboard
- ✅ Investor Dashboard
- ✅ **Payment Tracking System** with milestones
- ✅ **Payment Schedule Timeline View**
- ✅ **Payment History**
- ✅ Interactive Payment Demo (accessible via "Watch Demo" button)

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Error**: `Cannot find module 'index.css'`
- **Fix**: Ensure `index.css` exists in the root of `contrack` directory (we just created it)

**Error**: `TypeScript errors`
- **Fix**: Run `npm run build` locally to see specific errors
- Common fix: Add `"skipLibCheck": true` to `tsconfig.json`

### Preview Loads but Shows Blank Page

**Cause**: React Router or SPA routing issue
- **Fix**: Already handled in `vercel.json` with rewrite rules

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_` for client-side access
- Example: `VITE_API_URL` instead of `API_URL`
- Access via `import.meta.env.VITE_API_URL` in code

---

## 🌐 Post-Deployment

### Accessing Your App
After deployment, you'll get a URL like:
```
https://contrack-xyz123.vercel.app
```

### Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### Continuous Deployment
Every push to your `main` branch will automatically trigger a new deployment!

---

## 📊 Monitoring

Vercel provides:
- **Analytics** - Page views, visitor data
- **Speed Insights** - Core Web Vitals
- **Logs** - Runtime and build logs
- **Previews** - Each PR gets a unique preview URL

---

## 🎯 Next Steps After Deployment

1. **Share the link** with your team/stakeholders
2. **Test all features**:
   - Login as CLIENT, VENDOR, INVESTOR
   - Create a contract
   - Test payment milestones
   - Mark payments as paid
3. **Monitor performance** via Vercel dashboard
4. **Iterate** based on feedback

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment**: [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy)

---

## ✅ You're All Set!

The ConTrack frontend is now ready for Vercel deployment. All required files have been created:
- ✅ `index.css` (missing file - now fixed)
- ✅ `vercel.json` (deployment config)
- ✅ `.vercelignore` (optimize deployment)

**Ready to deploy! 🚀**
