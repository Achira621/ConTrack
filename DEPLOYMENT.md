# ConTrack Platform - Deployment Guide

## 📦 Repositories

- **Backend**: [https://github.com/Achira621/ConTrack.git](https://github.com/Achira621/ConTrack.git)
- **Frontend**: `d:/hackathon/frontend/contrack` (to be deployed separately)

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/Achira621/ConTrack.git
cd ConTrack

# Install dependencies
npm install

# Setup database
cd packages/database
cp .env.example .env
# Edit .env with your PostgreSQL connection string
npx prisma generate
npx prisma db push
```

### 2. Frontend Setup

```bash
cd d:/hackathon/frontend/contrack
npm install
npm run dev
```

---

## 🗄️ Database Setup (Free Tier)

Choose one of these free PostgreSQL providers:

### Option A: Neon (Recommended)
1. Visit [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Paste in `packages/database/.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
   ```

### Option B: Supabase
1. Visit [supabase.com](https://supabase.com)
2. Create project
3. Go to Settings → Database
4. Copy "Connection string" (Direct connection)
5. Update `.env`

### Option C: Vercel Postgres
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel postgres create`
3. Link to project
4. Environment variable auto-configured

---

## 🔧 Vercel Deployment

### Backend (Serverless Functions)

1. Create `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/*/index.ts",
      "use": "@vercel/node"
    }
  ]
}
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`

### Frontend

```bash
cd d:/hackathon/frontend/contrack
vercel --prod
```

---

## ✅ Post-Deployment Checklist

- [ ] Database connected and migrations applied
- [ ] Backend API endpoints accessible
- [ ] Frontend loads and shows login screen
- [ ] Role selection works (Client/Vendor/Investor)
- [ ] Dashboards render for each role
- [ ] No console errors

---

## 🧪 Testing Flows

### 1. Investor Pool Flow
```typescript
// 1. Create Pool
POST /api/pools
{ name: "Test Pool", riskCategory: "MEDIUM_RISK" }

// 2. Invest
POST /api/pools/:poolId/invest
{ investorId: "...", amount: 1000 }

// 3. Check NAV
GET /api/pools/:poolId
```

### 2. Contract Flow
```typescript
// 1. Create Contract (Client)
POST /api/contracts
{ title: "...", value: 5000, clientId: "..." }

// 2. Create Exposure (Pool underwrites)
POST /api/exposures
{ poolId: "...", contractId: "...", exposureAmount: 5000 }

// 3. Settle Contract
POST /api/contracts/:contractId/settle
```

---

## 📊 Architecture Verification

Test fault tolerance:
1. Stop database → Frontend should show "Offline" state
2. Invalid input → Intake layer rejects with artifact
3. Pool exposure > available capital → Error returned, no crash

---

## 🔐 Environment Variables

### Backend
```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

### Frontend
```env
VITE_API_URL="https://your-backend.vercel.app"
```

---

## 🆘 Troubleshooting

**Prisma errors**: Run `npx prisma generate` after install  
**Connection refused**: Check DATABASE_URL format  
**CORS errors**: Add frontend URL to backend CORS whitelist  
**Build fails**: Ensure all TypeScript configs are valid

---

## 📝 Next Steps

1. **API Layer**: Create REST/tRPC endpoints for each package
2. **Frontend Integration**: Wire dashboards to real API calls
3. **Authentication**: Add JWT/OAuth for real auth
4. **Testing**: Write unit + integration tests
5. **Monitoring**: Add logging service (Sentry/LogRocket)
