# Database Health Check Feature

## Quick Test

Test if database is connected:

```bash
# Visit in browser:
https://con-track.vercel.app/api/health/database

# Or use curl:
curl https://con-track.vercel.app/api/health/database
```

## Local Testing

```bash
# From d:\hackathon\ConTrack directory:
node verify-db-connection.js
```

## What Was Created

### 1. Health Check Endpoint
**File**: `api/health/database.ts`  
**URL**: `/api/health/database`

Returns:
- ✅ **200** if database is connected and healthy
- ❌ **503** if database is unavailable

Response example (success):
```json
{
  "success": true,
  "status": "healthy",
  "message": "Database connection is working",
  "data": {
    "connected": true,
    "responseTime": "45ms",
    "database": {
      "users": 0,
      "contracts": 0
    }
  }
}
```

Response example (failure):
```json
{
  "success": false,
  "status": "unhealthy",
  "error": "Can't reach database server",
  "details": {
    "responseTime": "5002ms",
    "errorType": "PrismaClientKnownRequestError",
    "code": "P1001"
  }
}
```

### 2. Connection Validator Script
**File**: `verify-db-connection.js`

Performs comprehensive checks:
1. ✓ DATABASE_URL environment variable
2. ✓ Prisma Client initialization
3. ✓ Database connection test
4. ✓ Schema verification
5. ✓ Write access test

Exit codes:
- `0` = All checks passed
- `1` = Connection failed (app should not start)

### 3. Database Middleware
**File**: `api/middleware/database-check.ts`

Middleware that prevents API requests from processing if database is not connected.

Usage in API endpoints:
```javascript
import { ensureDatabaseConnection } from './middleware/database-check';

export default async function handler(req, res) {
  await ensureDatabaseConnection(req, res, async () => {
    // Your API logic here - only runs if DB is connected
  });
}
```

## How It Works

The health check will **PREVENT** the application from responding successfully if database is not connected:

1. Every API call checks database connection
2. If connection fails, returns 503 Service Unavailable
3. Frontend will see the error and can show a maintenance message
4. No data corruption or partial operations

## Integration

To use in your package.json:
```json
{
  "scripts": {
    "prestart": "node verify-db-connection.js",
    "start": "your-start-command"
  }
}
```

This ensures the app won't start unless database is connected!
