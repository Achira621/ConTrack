// Quick database connection test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('🔍 Testing database connection...');

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Database connection successful!');
        console.log('Query result:', result);

        // Try to count users
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);

        await prisma.$disconnect();
        console.log('✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error.message);
        console.error('\nFull error:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

testConnection();
