# Quick Deployment Guide - ConTrack Database Fix

## What Was Fixed

✅ **DATABASE_URL Environment Variable** - Fixed on Vercel dashboard (removed `psql` prefix)

🚀 **Ready to Deploy**: API endpoints created locally but not yet deployed

---

## Option 1: Deploy via Vercel Dashboard (EASIEST)

Since git push failed due to repository conflicts, use this method:

1. **Create a ZIP file** of your local changes:
   - Select these folders/files:
     - `api/` folder
     - `vercel.json`
     - All `packages/` folders
   - Right-click → Send to → Compressed (zipped) folder
   - Name it `contrack-api-fix.zip`

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Third-Party Git Repository"
   - Or use drag-and-drop to upload the ZIP file
   - Link to existing project `con-track`

---

## Option 2: Fix Git and Push (Advanced)

```bash
# Navigate to project
cd d:\hackathon\ConTrack

# Force pull with allow-unrelated-histories
git pull origin main --allow-unrelated-histories

# Resolve any conflicts if they appear
# Then add and commit changes
git add .
git commit -m "Add API endpoints and database fix"

# Push to GitHub (this will trigger Vercel deployment)
git push origin main
```

---

## Option 3: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to project
cd d:\hackathon\ConTrack

# Login to Vercel
vercel login

# Link to existing project
vercel link --project con-track

# Deploy
vercel --prod
```

---

## After Deployment: Verify It Works

1. Open https://con-track.vercel.app/
2. Click **Login**
3. Sign in as Client (`test@example.com`)
4. **Expected Result**: Dashboard loads WITHOUT "Failed to load contracts" error

---

## If You Still See Errors

The DATABASE_URL is already fixed, so the only remaining issue is deploying the API endpoints. Use one of the options above to deploy the `api/` folder to Vercel.

**Files that need to be deployed**:
- `api/contracts.ts` - GET endpoint
- `api/contracts/create.ts` - POST endpoint
- `vercel.json` - Configuration

**Current Status**:
- ✅ DATABASE_URL fixed on Vercel
- ✅ API endpoints created locally
- ⏳ Waiting for deployment to Vercel

---

## Test the Fix Manually (After Deployment)

Visit these URLs to test:
```
GET https://con-track.vercel.app/api/contracts?userId=test-user-id
```

Should return JSON with contracts list (may be empty).

If you see 404, the API files haven't been deployed yet.
