# GitHub Push Instructions

## ✅ Git Repository Initialized

Your local Git repository is ready with all files committed!

---

## 🚀 Push to GitHub - Step by Step

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `contrack-frontend` (or your choice)
3. **Description**: "Intelligent Contract Management Platform with Payment Tracking"
4. **Visibility**: Public ✅ (or Private if you prefer)
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 2: Copy the Remote URL

After creating the repo, GitHub will show you a URL like:
```
https://github.com/YOUR_USERNAME/contrack-frontend.git
```

Copy this URL!

### Step 3: Push Your Code

Run these commands in your terminal:

```powershell
cd d:\hackathon\frontend\contrack

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/contrack-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username!

### Alternative: If You Get Authentication Error

If GitHub asks for credentials, you have two options:

#### Option A: Use GitHub CLI (Recommended)
```powershell
# Install GitHub CLI if not already installed
winget install GitHub.cli

# Login
gh auth login

# Then push
git push -u origin main
```

#### Option B: Personal Access Token
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Use it as password when pushing

---

## 🔄 Redeploy to Vercel (After Push)

Once your code is on GitHub:

### Method 1: Automatic (if already connected)
- If you deployed via Vercel dashboard before, just push to `main` branch
- Vercel will auto-deploy the new version

### Method 2: New Deployment
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select `contrack-frontend`
4. Click **Deploy**

The build error should now be fixed! ✅

---

## ✅ What Was Fixed

### Original Error
```
sh: line 1: vite: command not found
Error: Command "vite build" exited with 127
```

### Root Cause
Vercel was trying to run `vite` directly instead of using npm scripts.

### Solution Applied
Updated `vercel.json`:
```json
{
  "framework": "vite",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": "dist"
}
```

Now Vercel will:
1. Run `npm install` to install dependencies (including vite)
2. Run `npm run build` which properly calls vite
3. Use `dist` folder for deployment

---

## 📋 Quick Reference Commands

```powershell
# Check Git status
git status

# View commit history
git log --oneline

# Push future changes
git add .
git commit -m "Your commit message"
git push

# View remote URL
git remote -v
```

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Add remote and push code
3. ✅ Deploy/redeploy on Vercel
4. ✅ Test the deployed app
5. ✅ Share the live URL!

---

## 🆘 Troubleshooting

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/contrack-frontend.git
```

### "failed to push some refs"
```powershell
git pull origin main --rebase
git push -u origin main
```

### Still getting build errors?
- Check Vercel deployment logs
- Ensure `vercel.json` was included in the push
- Verify `package.json` has correct scripts

---

**You're all set!** 🎉 Push to GitHub and redeploy!
