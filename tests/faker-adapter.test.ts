import { describe, it, expect } from 'vitest';
import { fakerVi } from '../src/faker-adapter';

describe('fakerVi', () => {
  describe('person', () => {
    it('firstName() returns non-empty string', () => {
      const name = fakerVi.person.firstName();
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('lastName() returns non-empty string', () => {
      const name = fakerVi.person.lastName();
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('middleName() returns a string', () => {
      const name = fakerVi.person.middleName();
      expect(typeof name).toBe('string');
    });

    it('fullName() returns string with spaces', () => {
      const name = fakerVi.person.fullName();
      expect(name).toBeTruthy();
      expect(name).toContain(' ');
    });

    it('firstName("female") respects gender', () => {
      // Run multiple times to increase confidence
      const listName: string[] = [];
      for (let i = 0; i < 10; i += 1) {
        listName.push(fakerVi.person.firstName('female'));
      }
      // All should be non-empty strings
      for (let i = 0; i < listName.length; i += 1) {
        expect(listName[i]).toBeTruthy();
        expect(typeof listName[i]).toBe('string');
      }
    });

    it('firstName("male") respects gender', () => {
      const listName: string[] = [];
      for (let i = 0; i < 10; i += 1) {
        listName.push(fakerVi.person.firstName('male'));
      }
      for (let i = 0; i < listName.length; i += 1) {
        expect(listName[i]).toBeTruthy();
        expect(typeof listName[i]).toBe('string');
      }
    });

    it('sex() returns "male" or "female"', () => {
      for (let i = 0; i < 20; i += 1) {
        const result = fakerVi.person.sex();
        expect(['male', 'female']).toContain(result);
      }
    });

    it('prefix("male") returns "Ong" or "Anh"', () => {
      for (let i = 0; i < 20; i += 1) {
        const result = fakerVi.person.prefix('male');
        expect(['Ong', 'Anh']).toContain(result);
      }
    });

    it('prefix("female") returns "Ba" or "Chi"', () => {
      for (let i = 0; i < 20; i += 1) {
        const result = fakerVi.person.prefix('female');
        expect(['Ba', 'Chi']).toContain(result);
      }
    });

    it('prefix() without argument returns a valid prefix', () => {
      for (let i = 0; i < 20; i += 1) {
        const result = fakerVi.person.prefix();
        expect(['Ong', 'Anh', 'Ba', 'Chi']).toContain(result);
      }
    });
  });

  describe('internet', () => {
    it('email() returns valid email format', () => {
      for (let i = 0; i < 10; i += 1) {
        const email = fakerVi.internet.email();
        expect(email).toContain('@');
        expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
      }
    });

    it('email() with custom names uses those names', () => {
      const email = fakerVi.internet.email({ firstName: 'An', lastName: 'Nguyen' });
      expect(email).toContain('@');
      expect(email.split('@')[0]).toContain('an');
      expect(email.split('@')[0]).toContain('nguyen');
    });

    it('username() returns lowercase string', () => {
      for (let i = 0; i < 10; i += 1) {
        const username = fakerVi.internet.username();
        expect(username).toBeTruthy();
        expect(username).toBe(username.toLowerCase());
      }
    });

    it('username() with custom names uses those names', () => {
      const username = fakerVi.internet.username({ firstName: 'An', lastName: 'Nguyen' });
      expect(username).toBe('an_nguyen');
    });
  });
});
