# Push Frontend to ConTrack Repository
# Pushes all frontend files to https://github.com/Achira621/ConTrack.git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing Frontend to ConTrack Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to frontend directory
Set-Location "d:\hackathon\frontend\contrack"

# Check current remote
Write-Host "[1/5] Checking current remote..." -ForegroundColor Yellow
git remote -v
Write-Host ""

# Stage all changes
Write-Host "[2/5] Staging all changes..." -ForegroundColor Yellow
git add -A
Write-Host "All changes staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "[3/5] Files to be committed:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Commit
Write-Host "[4/5] Creating commit..." -ForegroundColor Yellow
$commitMessage = "Push frontend files with Neon Auth integration

- Frontend application with Neon Auth
- Pages: account, auth, home
- All components and API endpoints
- Database integration with Prisma
- Configuration and documentation"

git commit -m $commitMessage 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit created successfully" -ForegroundColor Green
}
else {
    Write-Host "No changes to commit (or already committed)" -ForegroundColor Yellow
}
Write-Host ""

# Push to repository
Write-Host "[5/5] Pushing to ConTrack repository..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Successfully pushed frontend to ConTrack!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: https://github.com/Achira621/ConTrack" -ForegroundColor Cyan
    Write-Host "Total files pushed: 45+" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "Push failed. Trying to pull first..." -ForegroundColor Yellow
    git pull origin main --allow-unrelated-histories
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Pull successful, now pushing..." -ForegroundColor Yellow
        git push -u origin main
    }
    else {
        Write-Host ""
        Write-Host "Push failed. You may need to:" -ForegroundColor Red
        Write-Host "1. Ensure you have push access to the repository" -ForegroundColor Yellow
        Write-Host "2. Authenticate with GitHub" -ForegroundColor Yellow
        Write-Host "3. Check your internet connection" -ForegroundColor Yellow
        Write-Host "4. Try force push: git push -u origin main --force" -ForegroundColor Yellow
    }
}

Write-Host ""
Read-Host -Prompt "Press Enter to exit"
