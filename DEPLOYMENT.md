# ConTrack Frontend - Vercel Deployment Guide

## � Quick Deploy to Vercel

### Prerequisites
- [ ] Vercel account (free tier works fine) - [Sign up here](https://vercel.com/signup)
- [ ] GitHub account (recommended for continuous deployment)
- [ ] Node.js 18+ installed locally (for testing builds)
- [ ] PostgreSQL database (Neon/Supabase/Vercel Postgres)

---

## 🗄️ Database Setup (Free Tier)

Choose one of these free PostgreSQL providers:

### Option A: Neon (Recommended)
1. Visit [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to Vercel environment variables:
   ```
   DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
   ```

### Option B: Supabase
1. Visit [supabase.com](https://supabase.com)
2. Create project
3. Go to Settings → Database
4. Copy "Connection string" (Direct connection)
5. Add to environment variables

### Option C: Vercel Postgres
1. In Vercel dashboard, go to Storage → Create Database
2. Select Postgres
3. Connection string auto-configured

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
cd d:\hackathon\ConTrack

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial ConTrack deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/Achira621/ConTrack.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `ConTrack` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `prisma generate && npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
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
cd d:\hackathon\ConTrack

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
- [ ] **Database URL configured** - Set in Vercel environment variables
- [ ] **Build works locally** - Run `npm run build` to verify
- [ ] **No TypeScript errors** - Run `npm run build` (Vite will report errors)

---

## 🧪 Test Build Locally (Recommended)

Before deploying, test the production build:

```bash
# Navigate to project
cd d:\hackathon\ConTrack

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
- ✅ **Contract Creation** with database persistence
- ✅ Interactive Payment Demo (accessible via "Watch Demo" button)
- ✅ Database connection via Prisma + PostgreSQL

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Error**: `Cannot find module 'index.css'`
- **Fix**: Ensure `index.css` exists in the root directory (should already be there)

**Error**: `TypeScript errors`
- **Fix**: Run `npm run build` locally to see specific errors
- Common fix: Add `"skipLibCheck": true` to `tsconfig.json`

**Error**: `Prisma client not generated`
- **Fix**: Ensure build command includes `prisma generate`
- Vercel build command should be: `prisma generate && npm run build`

### Preview Loads but Shows Blank Page

**Cause**: React Router or SPA routing issue
- **Fix**: Already handled in `vercel.json` with rewrite rules

### Database Connection Errors

**Error**: `P1001: Can't reach database server`
- **Fix**: Verify `DATABASE_URL` is correctly set in Vercel environment variables
- **Fix**: Ensure database allows connections from all IPs (0.0.0.0/0) or Vercel's IP ranges

**Error**: `SSL connection required`
- **Fix**: Add `?sslmode=require` to your connection string

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

## ✅ Post-Deployment Verification

Test these flows after deployment:

### 1. Authentication
- [ ] Login as CLIENT
- [ ] Login as VENDOR
- [ ] Login as INVESTOR

### 2. Contract Flow
- [ ] Create new contract with milestones
- [ ] View contract in dashboard
- [ ] Verify payment schedules are created

### 3. Database Connection
- [ ] Check Vercel logs for database connection status
- [ ] Verify contracts are persisted in database
- [ ] Open Prisma Studio locally: `npx prisma studio`

---

## 📊 Monitoring

Vercel provides:
- **Analytics** - Page views, visitor data
- **Speed Insights** - Core Web Vitals
- **Logs** - Runtime and build logs (check for database errors)
- **Previews** - Each PR gets a unique preview URL

---

## 🔐 Environment Variables Reference

### Required
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |

### Optional
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |

---

## � Common Issues

### "Database connection unavailable"
- Verify `DATABASE_URL` is set in Vercel
- Check database provider allows external connections
- Verify SSL mode if required

### "Prisma Client not initialized"
- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Or add to build command: `prisma generate && npm run build`

### CORS Errors
- API routes already handle CORS in `api/contracts.ts`
- Verify `Access-Control-Allow-Origin` headers

---

## 📝 Next Steps After Deployment

1. **Share the link** with your team/stakeholders
2. **Test all features**:
   - Login as CLIENT, VENDOR, INVESTOR
   - Create a contract
   - Test payment milestones
   - Mark payments as paid
3. **Monitor performance** via Vercel dashboard
4. **Check database** via Prisma Studio or database provider dashboard
5. **Iterate** based on feedback

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment**: [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

## ✅ You're All Set!

The ConTrack platform is now ready for Vercel deployment with full database integration. All required files have been created:
- ✅ `index.css` (styling)
- ✅ `vercel.json` (deployment config)
- ✅ `.vercelignore` (optimize deployment)
- ✅ `prisma/schema.prisma` (database schema)
- ✅ `api/` endpoints (serverless functions)

**Ready to deploy! 🚀**
