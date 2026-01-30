@echo off
echo Adding all changes to git...
git add .

echo.
echo Committing changes...
git commit -m "Integrate authentication API endpoint with Prisma database connection"

echo.
echo Checking current branch...
git branch

echo.
echo Git operations complete!
pause
