import { describe, it, expect } from 'vitest';
import { parseName } from '../src/parse-name';

describe('parseName', () => {
  it('parses basic three-part name', () => {
    const result = parseName('Nguyễn Văn An');
    expect(result).toEqual({
      surname: 'Nguyễn',
      middleName: 'Văn',
      givenName: 'An',
      fullName: 'Nguyễn Văn An',
    });
  });

  it('parses compound surname', () => {
    const result = parseName('Tôn Thất Minh An');
    expect(result).toEqual({
      surname: 'Tôn Thất',
      middleName: 'Minh',
      givenName: 'An',
      fullName: 'Tôn Thất Minh An',
    });
  });

  it('parses two-word name (no middle name)', () => {
    const result = parseName('Nguyễn An');
    expect(result).toEqual({
      surname: 'Nguyễn',
      middleName: '',
      givenName: 'An',
      fullName: 'Nguyễn An',
    });
  });

  it('parses compound given name', () => {
    const result = parseName('Nguyễn Văn Bảo Long');
    expect(result).toEqual({
      surname: 'Nguyễn',
      middleName: 'Văn',
      givenName: 'Bảo Long',
      fullName: 'Nguyễn Văn Bảo Long',
    });
  });

  it('treats known single surname as surname', () => {
    const result = parseName('An');
    expect(result).toEqual({
      surname: 'An',
      middleName: '',
      givenName: '',
      fullName: 'An',
    });
  });

  it('treats unknown single word as given name', () => {
    const result = parseName('Tuấn');
    expect(result).toEqual({
      surname: '',
      middleName: '',
      givenName: 'Tuấn',
      fullName: 'Tuấn',
    });
  });

  it('handles empty string', () => {
    const result = parseName('');
    expect(result).toEqual({
      surname: '',
      middleName: '',
      givenName: '',
      fullName: '',
    });
  });

  it('parses romanized input without diacritics', () => {
    const result = parseName('Nguyen Van An');
    expect(result).toEqual({
      surname: 'Nguyen',
      middleName: 'Van',
      givenName: 'An',
      fullName: 'Nguyen Van An',
    });
  });

  it('handles whitespace-only input', () => {
    const result = parseName('   ');
    expect(result).toEqual({
      surname: '',
      middleName: '',
      givenName: '',
      fullName: '',
    });
  });

  it('handles extra whitespace between words', () => {
    const result = parseName('  Nguyễn   Văn   An  ');
    expect(result).toEqual({
      surname: 'Nguyễn',
      middleName: 'Văn',
      givenName: 'An',
      fullName: 'Nguyễn Văn An',
    });
  });

  it('treats known single surname as surname only', () => {
    const result = parseName('Nguyễn');
    expect(result).toEqual({
      surname: 'Nguyễn',
      middleName: '',
      givenName: '',
      fullName: 'Nguyễn',
    });
  });

  it('parses compound surname with only given name (no middle)', () => {
    const result = parseName('Tôn Thất An');
    expect(result).toEqual({
      surname: 'Tôn Thất',
      middleName: '',
      givenName: 'An',
      fullName: 'Tôn Thất An',
    });
  });

  it('parses romanized compound surname', () => {
    const result = parseName('Ton That Minh An');
    expect(result).toEqual({
      surname: 'Ton That',
      middleName: 'Minh',
      givenName: 'An',
      fullName: 'Ton That Minh An',
    });
  });
});
