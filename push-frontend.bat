@echo off
echo ========================================
echo Pushing Frontend to ConTrack Repository
echo ========================================
echo.

cd /d d:\hackathon\frontend\contrack

echo [1/5] Checking current remote...
git remote -v
echo.

echo [2/5] Staging all changes...
git add -A
echo All changes staged
echo.

echo [3/5] Files to be committed:
git status --short
echo.

echo [4/5] Creating commit...
git commit -m "Push frontend files with Neon Auth integration"
echo.

echo [5/5] Pushing to ConTrack repository...
git push -u origin main
echo.

if %errorlevel% neq 0 (
    echo Push failed, trying to pull first...
    git pull origin main --allow-unrelated-histories
    git push -u origin main
)

echo ========================================
echo Check above for success/error messages
echo ========================================
echo Repository: https://github.com/Achira621/ConTrack
echo.

pause
