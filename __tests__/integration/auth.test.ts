import { POST as signupPOST } from '@/app/api/auth/signup/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

import mongoose from 'mongoose';

// Cleanup function to remove test users
async function cleanupTestUser(email: string) {
  try {
    await connectDB();
    await User.deleteOne({ email });
  } catch (error) {
    console.error('Error cleaning up test user:', error);
  }
}

describe('Authentication API Integration Tests', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';
  const testName = 'Test User';

  // Cleanup after all tests
  afterAll(async () => {
    await cleanupTestUser(testEmail);
    // Fermer la connexion MongoDB pour éviter les fuites
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: testName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(testEmail.toLowerCase());
      expect(data.user.name).toBe(testName);
      expect(data.token).toBeDefined();
      expect(data.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject duplicate email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: testName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.message).toContain('already exists');
    });

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: testPassword,
          name: testName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid email');
    });

    it('should reject short password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: `test2-${Date.now()}@example.com`,
          password: '12345',
          name: testName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject missing fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(testEmail.toLowerCase());
      expect(data.token).toBeDefined();
    });

    it('should reject incorrect password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'wrongpassword'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Incorrect email or password');
    });

    it('should reject non-existent user', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: `nonexistent-${Date.now()}@example.com`,
          password: testPassword
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Incorrect email or password');
    });

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: testPassword
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid email');
    });

    it('should reject missing fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('required');
    });
  });
});
