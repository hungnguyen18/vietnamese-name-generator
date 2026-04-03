import { describe, it, expect } from 'vitest';
import { generateGenZNickname } from '../src/generate-genz-nickname';
import type { IGenZNicknameResult, IGenZNicknameOptions } from '../src/generate-genz-nickname';
import type { TGenZNicknameStyle } from '../src/data/genz-nickname-patterns';

describe('generateGenZNickname', () => {
  it('returns all required fields', () => {
    const result = generateGenZNickname({ seed: 1 });
    expect(result.nickname).toBeTruthy();
    expect(result.style).toBeTruthy();
    expect(result.origin).toBeTruthy();
    expect(result.culturalNote).toBeTruthy();
  });

  it('random mode produces a nickname', () => {
    const result = generateGenZNickname({ seed: 42 });
    expect(result.nickname.length).toBeGreaterThan(0);
  });

  it('from-name mode transforms a Vietnamese name', () => {
    const result = generateGenZNickname({ name: 'Nguyễn Minh Anh', seed: 10 });
    expect(result.nickname.length).toBeGreaterThan(0);
  });

  it('style=jp-suffix produces Japanese suffix nickname', () => {
    const result = generateGenZNickname({ name: 'Trần Thảo Linh', style: 'jp-suffix', seed: 5 });
    expect(result.style).toBe('jp-suffix');
    expect(result.nickname).toMatch(/-chan|-kun|-san|-sama|-senpai/);
  });

  it('style=kr-suffix produces Korean suffix nickname', () => {
    const result = generateGenZNickname({ name: 'Lê Hoàng Khang', style: 'kr-suffix', seed: 5 });
    expect(result.style).toBe('kr-suffix');
    expect(result.nickname).toMatch(/oppa|unnie|-ah|-ya/);
  });

  it('style=cute produces cute nickname', () => {
    const result = generateGenZNickname({ style: 'cute', seed: 5 });
    expect(result.style).toBe('cute');
  });

  it('style=social-handle produces handle', () => {
    const result = generateGenZNickname({ name: 'Phạm Bảo Ngọc', style: 'social-handle', seed: 5 });
    expect(result.style).toBe('social-handle');
  });

  it('style=meme produces meme nickname', () => {
    const result = generateGenZNickname({ style: 'meme', seed: 5 });
    expect(result.style).toBe('meme');
  });

  it('style=english-viet produces English+VN combo', () => {
    const result = generateGenZNickname({ name: 'Nguyễn Văn Nam', style: 'english-viet', seed: 5 });
    expect(result.style).toBe('english-viet');
  });

  it('is deterministic with seed', () => {
    const a = generateGenZNickname({ seed: 99 });
    const b = generateGenZNickname({ seed: 99 });
    expect(a.nickname).toBe(b.nickname);
    expect(a.style).toBe(b.style);
  });

  it('different seeds produce variety', () => {
    const nicknames = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      nicknames.add(generateGenZNickname({ seed: i }).nickname);
    }
    expect(nicknames.size).toBeGreaterThan(10);
  });

  it('gender=male for english-viet', () => {
    const result = generateGenZNickname({ gender: 'male', style: 'english-viet', seed: 1 });
    expect(result.nickname).toBeTruthy();
  });

  it('gender=female for english-viet', () => {
    const result = generateGenZNickname({ gender: 'female', style: 'english-viet', seed: 1 });
    expect(result.nickname).toBeTruthy();
  });
});
