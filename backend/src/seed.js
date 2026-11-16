const path = require('path');
const dotenv = require('dotenv');

// Robust dotenv loading: always loads backend/.env regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const mongoose = require('mongoose');
const { seedDatabaseIfEmpty } = require('./models/seeder');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI is not defined in backend/.env!');
  console.error('👉 Please make sure backend/.env contains a valid MongoDB Atlas connection string.\n');
  process.exit(1);
}

async function runSeed() {
  console.log('\n======================================================');
  console.log('🚀 TRAVELYN MONGODB ATLAS DATABASE INITIALIZER');
  console.log('======================================================\n');
  console.log('⏳ Connecting to MongoDB Atlas cluster...');

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    const dbName = mongoose.connection.name || 'Travelyn';
    console.log(`🍃 Connected successfully to MongoDB Atlas! [Database: ${dbName}]\n`);

    console.log('📦 Creating and seeding all collections with luxury travel data:');
    await seedDatabaseIfEmpty();

    // Verify collections created
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📋 Current collections in '${dbName}':`);
    for (const c of collections) {
      const count = await mongoose.connection.db.collection(c.name).countDocuments();
      console.log(`   ✨ ${c.name} (${count} documents)`);
    }

    console.log('\n🎉 SUCCESS: Database "Travelyn" has been created and populated in MongoDB Atlas!');
    console.log('👉 Open MongoDB Compass or Atlas Data Modeling and click the Refresh button (🔄).\n');
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:', error.message);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('👉 Tip: Check your MongoDB Atlas username and password in MONGODB_URI.');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('selection timed out') || error.message.includes('whitelist')) {
      console.error('👉 Tip: Check MongoDB Atlas "Network Access". Ensure "0.0.0.0/0" (Allow Access from Anywhere) is added.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connection closed.');
    process.exit(0);
  }
}

runSeed();
