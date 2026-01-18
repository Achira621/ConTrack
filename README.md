# ConTrack Backend

Modular backend for the ConTrack Platform using a fault-tolerant layered architecture.

## Architecture

### Packages

- **database**: Prisma schema + client (PostgreSQL)
- **intake**: Input validation with Zod
- **investor-pool**: Non-lending Unit/NAV pool management
- **settlement**: Contract finalization & payout calculation
- **scoring**: [Placeholder - Add contract scoring logic]
- **verification**: [Placeholder - Add proof verification]
- **notification**: [Placeholder - Add event notifications]
- **reporting**: [Placeholder - Add dashboard data]

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
