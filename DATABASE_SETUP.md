# Database Setup Guide for ConTrack

## Quick Start Options

Choose one of these serverless PostgreSQL providers for fastest deployment:

### Option 1: Neon (Recommended) ⚡️

**Why**: Free tier, instant setup, serverless-native, no cold starts

1. **Sign up**: https://neon.tech
2. **Create project**: Click "New Project"
3. **Copy connection string**: 
   ```
   postgresql://user:password@ep-xyz.neon.tech/contrack?sslmode=require
   ```
4. **Add to Vercel**:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add `DATABASE_URL` = your connection string

### Option 2: Supabase 🔥

**Why**: Free tier, built-in auth (optional), pooling included

1. **Sign up**: https://supabase.com
2. **Create project**
3. **Get connection string**:
   - Settings → Database
   - Copy "Connection pooling" URL (port 6543)
4. **Add to Vercel**: Same as above

### Option 3: Vercel Postgres 🚀

**Why**: Integrated with Vercel, one-click setup

1. **In Vercel project**:
   - Storage → Create Database
   - Choose "Postgres"
2. **Auto-configured**: `DATABASE_URL` added automatically

---

## Local Development Setup

### 1. Create `.env` file

```bash
cd d:/hackathon/frontend/contrack
cp .env.example .env
```

### 2. Add your database URL

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@host/contrack?schema=public"
```

### 3. Run Prisma migrations

```bash
# Install dependencies (if not done)
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Verify setup

```bash
# Open Prisma Studio to view database
npx prisma studio
```

Should open at `http://localhost:5555`

---

## Vercel Deployment Setup

### Step 1: Add Environment Variable

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environments**: Production, Preview, Development (all checked)
3. Click **Save**

### Step 2: Redeploy

Vercel should auto-deploy when you push to GitHub. If not:

```bash
# Trigger manual deploy
git commit --allow-empty -m "trigger deploy"
git push origin main
```

### Step 3: Verify Deployment

1. Check Vercel deployment logs
2. Look for "Prisma schema loaded from prisma/schema.prisma"
3. Test API endpoint:
   ```
   https://your-app.vercel.app/api/contracts?userId=test
   ```

---

## Database Schema Migration

Your Prisma schema is already set up in `prisma/schema.prisma`.

When you run `npx prisma db push`, it will create:

- ✅ `User` table (id, email, name, role)
- ✅ `Contract` table (title, description, value, status, clientId, vendorId)
- ✅ `PaymentSchedule` table (milestones)
- ✅ `Payment` table (payment tracking)
- ✅ `Event` table (audit log)

### Seed Data (Optional)

To add test data:

```bash
# Create seed file
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    create: {
      email: 'client@test.com',
      name: 'Test Client',
      role: 'CLIENT',
    },
    update: {},
  });

  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@test.com' },
    create: {
      email: 'vendor@test.com',
      name: 'Test Vendor',
      role: 'VENDOR',
    },
    update: {},
  });

  console.log({ client, vendor });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
EOF

# Run seed
npx tsx prisma/seed.ts
```

---

## Troubleshooting

### Error: "Can't reach database server"

**Solution**: Check your `DATABASE_URL` format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

For Neon/Supabase, ensure `?sslmode=require` is added.

### Error: "Prisma Client not generated"

**Solution**:
```bash
npx prisma generate
```

If on Vercel, ensure `postinstall` script runs:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Error: "Connection pool timeout"

**Solution**: Use connection pooling URL (port 6543 for Supabase, or Neon pooler URL)

### Vercel deployment succeeds but API fails

1. Check Vercel logs: `Runtime Logs` tab
2. Verify `DATABASE_URL` is set in Production environment
3. Check API endpoint exists: `/api/contracts.ts`

---

## Security Notes

- ✅ Never commit `.env` to Git (already in `.gitignore`)
- ✅ Use environment variables in Vercel
- ✅ Connection strings include SSL by default
- ⚠️ Current auth is simple (email-based) - upgrade for production

---

## Next Steps

Once database is set up:

1. **Test contract creation**:
   - Login as CLIENT
   - Create contract via modal
   - Check database in Prisma Studio

2. **Verify persistence**:
   - Refresh page
   - Contract should still appear (from DB, not localStorage)

3. **Check events**:
   - Open Prisma Studio
   - View `Event` table
   - Should see `CONTRACT_CREATED`, `PAYMENT_SCHEDULE_CREATED` events

---

## Database Provider Comparison

| Provider | Free Tier | Setup Time | Serverless | Connection Pooling |
|----------|-----------|------------|------------|-------------------|
| **Neon** | 3GB, always on | 2 min | ✅ Native | ✅ Included |
| **Supabase** | 500MB | 3 min | ✅ Yes | ✅ Port 6543 |
| **Vercel Postgres** | 256MB | 1 min | ✅ Native | ✅ Included |

**Recommendation**: Use **Neon** for hackathon/demo, upgrade to dedicated Postgres for production.
