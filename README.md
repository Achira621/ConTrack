# ConTrack - Contract Management Platform

![ConTrack](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

**Live Demo**: https://con-track-ioin.vercel.app/

---

## Overview

ConTrack is a premium contract management platform that transforms static agreements into dynamic financial workflows. Built with a modular backend architecture and modern frontend, it creates, manages, and tracks contracts with milestone-based payments, real-time updates, and intelligent event tracking.

### Key Features

✨ **Hero-Styled UI** - Serif headlines, pill buttons, soft shadows, premium animations  
📝 **Contract Creation** - Guided form with validation and milestone configuration  
💰 **Milestone Payments** - Dynamic payment schedules with percentage tracking  
🔔 **Event Tracking** - Audit log for all contract actions and state changes  
💾 **Database Persistence** - PostgreSQL via Prisma ORM for serverless deployment  
⚡️ **Serverless API** - Vercel serverless functions for scalable backend  
🎯 **RBAC System** - CLIENT, VENDOR, INVESTOR, ADMIN role-based access control  
📊 **Risk Scoring** - ConScore AI-inspired 0-100 scoring with risk tiers  
🏦 **Investor Pool** - Non-lending mutual-fund style Unit/NAV pool (RBI/SEBI compliant)  

---

## Tech Stack

**Frontend**:
- React 19 + TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Lucide React (icons)
- Modern CSS (no Tailwind needed)

**Backend**:
- Vercel Serverless Functions
- Prisma ORM
- PostgreSQL (Neon/Supabase/Vercel Postgres)
- Modular package architecture

**Deployment**:
- Vercel (auto-deploy from GitHub)
- GitHub Actions (CI/CD ready)

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (see [Database Setup](#database-setup))
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Achira621/ConTrack.git
cd ConTrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/contrack?schema=public"
```

Run migrations:

```bash
npx prisma generate
npx prisma db push
```

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Database Setup

### Quick Option: Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `.env` as `DATABASE_URL`

### Alternatives

- **Supabase**: https://supabase.com
- **Vercel Postgres**: Built into Vercel dashboard

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for full guide.

---

## Architecture

### Backend Packages

The backend follows a fault-tolerant layered architecture with modular packages:

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

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Achira621/ConTrack)

1. **Connect GitHub**: Import repository
2. **Add Environment Variables**:
   - `DATABASE_URL` - Your PostgreSQL connection string
3. **Deploy**: Auto-deploys on push to `main`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Environment Variables

Required for Vercel deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |

---

## Project Structure

```
ConTrack/
├── api/                    # Vercel serverless functions
│   ├── auth.ts            # User authentication
│   ├── contracts.ts       # Contract CRUD operations
│   └── health.ts          # Database health check
├── components/            # React components
│   ├── Hero.tsx          # Landing page hero
│   ├── ContractCreationModal.tsx  # Contract form
│   ├── ClientDashboard.tsx        # Client view
│   ├── VendorDashboard.tsx        # Vendor view
│   ├── InvestorDashboard.tsx      # Investor view
│   ├── PaymentTracker.tsx         # Payment tracking
│   └── ...
├── lib/                   # Utilities
│   └── prisma.ts         # Prisma client singleton
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── types.ts              # TypeScript types
├── App.tsx               # Main app component
└── vercel.json           # Vercel configuration
```

---

## API Endpoints

### POST `/api/auth`

Authenticate or create user.

**Request**:
```json
{
  "email": "client@example.com",
  "role": "CLIENT"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "client@example.com",
    "name": "client",
    "role": "CLIENT"
  }
}
```

### POST `/api/contracts`

Create new contract with optional milestones.

**Request**:
```json
{
  "title": "Website Redesign",
  "description": "Full UI overhaul",
  "clientId": "clx...",
  "vendorEmail": "vendor@example.com",
  "value": 15000,
  "milestones": [
    { "name": "Design", "percentage": 40, "description": "UI mockups" },
    { "name": "Development", "percentage": 60, "description": "Implementation" }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "contract": { ... }
}
```

### GET `/api/contracts?userId={userId}`

Get all contracts for user.

**Response**:
```json
{
  "contracts": [
    {
      "id": "clx...",
      "title": "Website Redesign",
      "value": 15000,
      "status": "DRAFT",
      "paymentSchedules": [ ... ]
    }
  ]
}
```

---

## Features Walkthrough

### 1. Contract Creation

- Click "Create New Contract" in dashboard
- Fill form with title, parties, value
- Optionally enable milestone-based payments
- Add milestones (must total 100%)
- Submit → Contract created in database

### 2. Milestone Configuration

- Toggle "Enable Milestone-Based Payments"
- Add milestones with name, percentage, description
- System validates total = 100%
- Creates `PaymentSchedule` records linked to contract

### 3. Dashboard

- View all contracts (client or vendor perspective)
- Real-time stats (active contracts, total value, settled)
- Recent contracts list with status badges
- Loading states and error handling

### 4. Event-Driven Architecture

All actions create `Event` records:
- `CONTRACT_CREATED`
- `PAYMENT_SCHEDULE_CREATED`
- `CONTRACT_ACTIVATED`
- `PAYMENT_COMPLETED`

Events provide audit trail and enable future notifications.

---

## Development

### Run Tests

```bash
npm run vitest  # (if tests are added)
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate
```

### Build for Production

```bash
npm run build
```

---

## Usage (Backend Packages)

Each package exports functions that can be imported and used:

```typescript
import { validateCreateContract } from '@contrack/intake';
import { investInPool } from '@contrack/investor-pool';
import { settleContract } from '@contrack/settlement';
```

---

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Support

- **Issues**: https://github.com/Achira621/ConTrack/issues
- **Discussions**: https://github.com/Achira621/ConTrack/discussions

---

## Roadmap

- [ ] Real authentication (NextAuth.js or Clerk)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Contract templates
- [ ] PDF generation
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Enhanced analytics dashboard
- [ ] Automated risk scoring improvements

---

Built with ❤️ for hackathons and beyond.
