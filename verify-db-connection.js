#!/usr/bin/env node
// Database Connection Validator
// Run this before starting the application to ensure database is connected
// Usage: node verify-db-connection.js

const { prisma } = require('./packages/database');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

async function verifyDatabaseConnection() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}   ConTrack Database Connection Validator${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    let exitCode = 0;

    try {
        // Step 1: Check Environment Variable
        console.log(`${colors.blue}[1/5]${colors.reset} Checking DATABASE_URL environment variable...`);
        if (!process.env.DATABASE_URL) {
            console.log(`${colors.red}✗ FAILED: DATABASE_URL environment variable is not set${colors.reset}`);
            console.log(`${colors.yellow}      Please create a .env file with DATABASE_URL${colors.reset}\n`);
            process.exit(1);
        }
        console.log(`${colors.green}✓ DATABASE_URL is set${colors.reset}\n`);

        // Step 2: Check Prisma Client
        console.log(`${colors.blue}[2/5]${colors.reset} Checking Prisma Client initialization...`);
        if (!prisma) {
            console.log(`${colors.red}✗ FAILED: Prisma client is not initialized${colors.reset}`);
            console.log(`${colors.yellow}      Run: cd packages/database && npx prisma generate${colors.reset}\n`);
            process.exit(1);
        }
        console.log(`${colors.green}✓ Prisma Client is initialized${colors.reset}\n`);

        // Step 3: Test Database Connection
        console.log(`${colors.blue}[3/5]${colors.reset} Testing database connection...`);
        const startTime = Date.now();
        await prisma.$connect();
        const connectionTime = Date.now() - startTime;
        console.log(`${colors.green}✓ Successfully connected to database (${connectionTime}ms)${colors.reset}\n`);

        // Step 4: Verify Schema
        console.log(`${colors.blue}[4/5]${colors.reset} Verifying database schema...`);
        try {
            const userCount = await prisma.user.count();
            const contractCount = await prisma.contract.count();
            const poolCount = await prisma.pool.count();

            console.log(`${colors.green}✓ Schema verified successfully${colors.reset}`);
            console.log(`   - Users: ${userCount}`);
            console.log(`   - Contracts: ${contractCount}`);
            console.log(`   - Pools: ${poolCount}\n`);
        } catch (schemaError) {
            console.log(`${colors.red}✗ Schema verification failed${colors.reset}`);
            console.log(`${colors.yellow}      Error: ${schemaError.message}${colors.reset}`);
            console.log(`${colors.yellow}      Run: cd packages/database && npx prisma db push${colors.reset}\n`);
            exitCode = 1;
        }

        // Step 5: Test Write Operation
        console.log(`${colors.blue}[5/5]${colors.reset} Testing database write access...`);
        try {
            // Try to create and delete a test log entry
            const testLog = await prisma.log.create({
                data: {
                    level: 'INFO',
                    layer: 'HEALTH_CHECK',
                    message: 'Database connection verification test'
                }
            });

            await prisma.log.delete({
                where: { id: testLog.id }
            });

            console.log(`${colors.green}✓ Write access verified${colors.reset}\n`);
        } catch (writeError) {
            console.log(`${colors.yellow}⚠ Write access test failed (may be read-only)${colors.reset}`);
            console.log(`   Error: ${writeError.message}\n`);
        }

    } catch (error) {
        console.log(`${colors.red}\n✗✗✗ DATABASE CONNECTION FAILED ✗✗✗${colors.reset}\n`);
        console.log(`Error: ${error.message}`);
        console.log(`\nDetails:`);
        console.log(`  Type: ${error.constructor.name}`);
        if (error.code) console.log(`  Code: ${error.code}`);
        if (error.meta) console.log(`  Meta:`, error.meta);

        console.log(`\n${colors.yellow}Troubleshooting:${colors.reset}`);
        console.log(`  1. Verify DATABASE_URL in .env file is correct`);
        console.log(`  2. Check if database server is accessible`);
        console.log(`  3. Run: cd packages/database && npx prisma generate`);
        console.log(`  4. Run: cd packages/database && npx prisma db push\n`);

        exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }

    // Final Status
    console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    if (exitCode === 0) {
        console.log(`${colors.green}   ✓ ALL CHECKS PASSED - DATABASE READY   ${colors.reset}`);
        console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
    } else {
        console.log(`${colors.red}   ✗ CHECKS FAILED - FIX ERRORS ABOVE      ${colors.reset}`);
        console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
    }

    process.exit(exitCode);
}

// Run the validator
verifyDatabaseConnection().catch((error) => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
    process.exit(1);
});
