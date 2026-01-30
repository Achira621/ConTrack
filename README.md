# ConTrack Backend

Modular backend for the ConTrack Platform using a fault-tolerant layered architecture.

## Architecture

### Packages

- **database**: Prisma schema + client (PostgreSQL)
- **intake**: Input validation with Zod
- **contracts**: Contract creation & activation (F1)
- **scoring**: ConScore risk assessment (F2)
- **verification**: Proof validation (F3)
- **settlement**: Payout calculation (F4)
- **investor-pool**: Non-lending Unit/NAV pool (F5)
- **recovery**: Payment recovery tracking (F6)
- **reporting**: Metrics & analytics (F7)
- **notification**: Event-driven messaging (F9)

### Features Implemented

✅ **F1: Contract Creation** - Vendor-to-Client contract with activation requirement  
✅ **F2: Risk Scoring (ConScore)** - AI-inspired 0-100 scoring with risk tiers  
✅ **F3: Proof Verification** - Evidence-based validation + manual fallback  
✅ **F4: Settlement Logic** - On-time/delayed/default flows with pool integration  
✅ **F5: Investor Pool** - Mutual-fund style Unit/NAV (RBI/SEBI compliant)  
✅ **F6: Recovery** - Client payment recovery with NAV adjustments  
✅ **F7: Reporting** - Vendor/Client/Investor/Pool metrics  
✅ **F8: Dashboards** - RBAC UI (Frontend)  
✅ **F9: Notifications** - Silent-fail messaging  
✅ **F10: Database** - Complete Prisma schema  

## Setup

1. Create a `.env` file in `packages/database`:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
cd packages/database
npx prisma generate
npx prisma db push  # Push schema to DB
```

## Usage

Each package exports functions that can be imported and used:

```typescript
import { validateCreateContract } from '@contrack/intake';
import { investInPool } from '@contrack/investor-pool';
import { settleContract } from '@contrack/settlement';
```

## Key Features

- **RBAC**: CLIENT, VENDOR, INVESTOR, ADMIN roles
- **Non-Lending Pool**: Mutual-fund style with Units & NAV
- **Fault Tolerance**: Each layer saves artifacts on success/failure
- **Vercel Ready**: PostgreSQL + serverless functions

## Database

Free Tier Options:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Vercel Postgres](https://vercel.com/postgres)
