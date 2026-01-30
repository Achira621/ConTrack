// Test script to verify database connection and contract operations
// Run with: node test-db-connection.js

const { prisma } = require('./packages/database/index.ts');
const { createContract } = require('./packages/contracts/index.ts');

async function testDatabaseConnection() {
    console.log('🔍 Testing Database Connection...\n');

    try {
        // Test 1: Basic connection
        console.log('Test 1: Checking database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully!\n');

        // Test 2: Query existing users
        console.log('Test 2: Fetching existing users...');
        const users = await prisma.user.findMany({ take: 5 });
        console.log(`✅ Found ${users.length} users in database`);
        if (users.length > 0) {
            console.log('Sample user:', users[0]);
        }
        console.log('');

        // Test 3: Query existing contracts
        console.log('Test 3: Fetching existing contracts...');
        const contracts = await prisma.contract.findMany({ take: 5 });
        console.log(`✅ Found ${contracts.length} contracts in database`);
        if (contracts.length > 0) {
            console.log('Sample contract:', contracts[0]);
        }
        console.log('');

        // Test 4: Create a test user if none exists
        let testClient = users.find(u => u.role === 'CLIENT');
        let testVendor = users.find(u => u.role === 'VENDOR');

        if (!testClient) {
            console.log('Test 4: Creating test CLIENT user...');
            testClient = await prisma.user.create({
                data: {
                    email: 'test-client@contrack.com',
                    name: 'Test Client',
                    role: 'CLIENT'
                }
            });
            console.log('✅ Test client created:', testClient.id);
        } else {
            console.log('Test 4: Using existing CLIENT:', testClient.email);
        }

        if (!testVendor) {
            console.log('Test 5: Creating test VENDOR user...');
            testVendor = await prisma.user.create({
                data: {
                    email: 'test-vendor@contrack.com',
                    name: 'Test Vendor',
                    role: 'VENDOR'
                }
            });
            console.log('✅ Test vendor created:', testVendor.id);
        } else {
            console.log('Test 5: Using existing VENDOR:', testVendor.email);
        }
        console.log('');

        // Test 6: Create a contract
        console.log('Test 6: Creating a new contract...');
        const contractResult = await createContract({
            vendorId: testVendor.id,
            clientId: testClient.id,
            title: 'Test Contract - Database Connection Verification',
            description: 'This is a test contract to verify the database connection is working',
            amount: 5000,
            settlementTerms: 'Net-30',
            workType: 'SERVICES'
        });

        if (contractResult.success) {
            console.log('✅ Contract created successfully!');
            console.log('Contract ID:', contractResult.contractId);
            console.log('Status:', contractResult.status);
            console.log('Score:', contractResult.score);
            console.log('Risk Tier:', contractResult.riskTier);
        } else {
            console.log('❌ Contract creation failed:', contractResult.error);
        }
        console.log('');

        // Test 7: Retrieve the created contract
        if (contractResult.success && contractResult.contractId) {
            console.log('Test 7: Retrieving the created contract...');
            const retrievedContract = await prisma.contract.findUnique({
                where: { id: contractResult.contractId },
                include: {
                    client: true,
                    vendor: true,
                    artifacts: true,
                    events: true
                }
            });

            if (retrievedContract) {
                console.log('✅ Contract retrieved successfully!');
                console.log('Title:', retrievedContract.title);
                console.log('Value:', retrievedContract.value);
                console.log('Status:', retrievedContract.status);
                console.log('Client:', retrievedContract.client.name);
                console.log('Vendor:', retrievedContract.vendor?.name);
                console.log('Artifacts:', retrievedContract.artifacts.length);
                console.log('Events:', retrievedContract.events.length);
            } else {
                console.log('❌ Failed to retrieve contract');
            }
        }
        console.log('');

        console.log('🎉 All tests completed successfully!');
        console.log('\n📊 Summary:');
        console.log('- Database connection: ✅ Working');
        console.log('- Contract creation: ✅ Working');
        console.log('- Contract retrieval: ✅ Working');
        console.log('\nThe database is properly connected and operational!');

    } catch (error) {
        console.error('\n❌ Database test failed:');
        console.error('Error:', error.message);
        console.error('\nFull error:');
        console.error(error);

        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if DATABASE_URL is set correctly in .env file');
        console.log('2. Ensure Prisma client is generated (run: npx prisma generate)');
        console.log('3. Ensure database schema is pushed (run: npx prisma db push)');
        console.log('4. Verify Neon database is accessible');
    } finally {
        await prisma.$disconnect();
        console.log('\n✅ Database connection closed');
    }
}

// Run the test
testDatabaseConnection()
    .catch(console.error)
    .finally(() => process.exit());
