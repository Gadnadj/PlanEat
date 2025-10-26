import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  isValidEmail,
  isValidPassword,
  isValidName,
} from '../auth';

describe('Authentication utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // bcrypt creates different hashes each time
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);

      const isValid = await verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashed = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify a valid token', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(userId);
    });

    it('should reject an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should reject an empty token', () => {
      const decoded = verifyToken('');
      expect(decoded).toBeNull();
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'test+tag@example.com',
        'user123@test-domain.org',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test @example.com',
        'test@example',
        '',
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidPassword', () => {
    it('should validate passwords with at least 6 characters', () => {
      const validPasswords = ['password', '123456', 'a'.repeat(128)];

      validPasswords.forEach(password => {
        const result = isValidPassword(password);
        expect(result.valid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should reject passwords shorter than 6 characters', () => {
      const invalidPasswords = ['12345', 'abc', ''];

      invalidPasswords.forEach(password => {
        const result = isValidPassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('6 caractères');
      });
    });

    it('should reject passwords longer than 128 characters', () => {
      const longPassword = 'a'.repeat(129);
      const result = isValidPassword(longPassword);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('128 caractères');
    });
  });

  describe('isValidName', () => {
    it('should validate names with at least 2 characters', () => {
      const validNames = ['John', 'Marie-Claire', 'Jean', 'a'.repeat(50)];

      validNames.forEach(name => {
        const result = isValidName(name);
        expect(result.valid).toBe(true);
        expect(result.message).toBe('');
      });
    });

    it('should reject names shorter than 2 characters', () => {
      const invalidNames = ['A', ''];

      invalidNames.forEach(name => {
        const result = isValidName(name);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('2 caractères');
      });
    });

    it('should reject names longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      const result = isValidName(longName);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('50 caractères');
    });

    it('should trim whitespace before validation', () => {
      const nameWithSpaces = '  John  ';
      const result = isValidName(nameWithSpaces);

      // The function should validate the trimmed name
      expect(result.valid).toBe(true);
    });
  });
});
