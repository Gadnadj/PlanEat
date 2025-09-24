// Script de diagnostic pour l'API meal-plans
// Utilisation: node diagnose-api.js

const mongoose = require('mongoose');

const diagnoseAPI = async () => {
  console.log('🔍 Starting API diagnosis...\n');
  
  // 1. Vérifier les variables d'environnement
  console.log('1. Environment Variables:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set');
  console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('');

  // 2. Tester la connexion MongoDB
  console.log('2. MongoDB Connection:');
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/plan-eat';
    console.log('   Connecting to:', MONGODB_URI.replace(/\/\/.*@/, '//*****@'));
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('   ✅ MongoDB connection successful');
    
    // Tester les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('   Collections found:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
  }
  console.log('');

  // 3. Tester l'API Next.js
  console.log('3. Next.js API:');
  try {
    const response = await fetch('http://localhost:3000/api/meal-plans', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log('   API endpoint status:', response.status);
    console.log('   Expected: 401 (Unauthorized) for invalid token');
    
    if (response.status === 401) {
      console.log('   ✅ API endpoint is responsive');
    } else {
      console.log('   ⚠️  Unexpected response');
      const text = await response.text();
      console.log('   Response:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('   ❌ API endpoint test failed:', error.message);
    console.log('   Make sure Next.js server is running (npm run dev)');
  }
  console.log('');

  // 4. Recommandations
  console.log('4. Recommendations:');
  console.log('   - Ensure Next.js development server is running');
  console.log('   - Check MongoDB is accessible');
  console.log('   - Verify all environment variables are set');
  console.log('   - Check network connectivity');
  console.log('   - Look at browser console for client-side errors');
  console.log('   - Check Next.js server logs for detailed error messages');
};

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

// Exécuter le diagnostic
diagnoseAPI().catch(console.error);
