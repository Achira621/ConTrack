# Enable script execution (run this in PowerShell as Administrator if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run these commands in your project directory:
cd d:\hackathon\frontend\contrack

# Generate Prisma Client
npx prisma generate

# Push schema to Neon database
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
