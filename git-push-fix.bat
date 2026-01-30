@echo off
echo =====================================
echo Git Push - Database Connection Fix
echo =====================================
echo.

cd /d d:\hackathon\ConTrack

echo [1/5] Checking git status...
git status
echo.

echo [2/5] Staging modified files...
git add api/auth.ts test-connection.js
echo.

echo [3/5] Creating commit...
git commit -m "Fix: Resolve TypeScript import error in api/auth.ts

- Removed .ts extension from prisma import path
- Changed from '../lib/prisma.ts' to '../lib/prisma'
- Fixes TS2307 module resolution error
- Added test-connection.js for database verification"
echo.

echo [4/5] Pushing to remote...
git push
echo.

echo [5/5] Verifying push...
git log -1 --oneline
echo.

echo =====================================
echo Git push completed!
echo =====================================
pause
