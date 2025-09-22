import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/plan-eat';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Utiliser une variable globale pour éviter de recréer des connexions
// dans un environnement de développement avec hot reload
let cached: Cached = (global as typeof globalThis & { mongoose: Cached }).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & { mongoose: Cached }).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connexion à MongoDB établie');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Erreur de connexion à MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
