# Git Push Script - PowerShell
# Commits and pushes database connection fixes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit & Push - Database Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "d:\hackathon\ConTrack"

# Check status
Write-Host "[1/5] Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Stage files
Write-Host "[2/5] Staging files..." -ForegroundColor Yellow
git add api/auth.ts test-connection.js
Write-Host "Staged: api/auth.ts, test-connection.js" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "[3/5] Creating commit..." -ForegroundColor Yellow
git commit -m "Fix: Resolve TypeScript import error in api/auth.ts

- Removed .ts extension from prisma import
- Changed '../lib/prisma.ts' to '../lib/prisma'
- Fixes TS2307 module resolution error
- Added test-connection.js for database verification"
Write-Host ""

# Push
Write-Host "[4/5] Pushing to remote..." -ForegroundColor Yellow
git push origin main
Write-Host ""

# Verify
Write-Host "[5/5] Verifying push..." -ForegroundColor Yellow
git log -1 --oneline
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Git push completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host -Prompt "Press Enter to exit"
