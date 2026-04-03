import { describe, it, expect } from 'vitest';
import {
  NICKNAME_TEMPLATES,
  CUTE_ANIMALS,
  CUTE_FOODS,
  MEME_PHRASES,
  FUNNY_TITLES,
  WESTERN_MALE,
  WESTERN_FEMALE,
  JP_SUFFIXES,
  KR_SUFFIXES,
  HANDLE_PREFIXES,
  CULTURAL_NOTES,
} from '../src/data/genz-nickname-patterns';

describe('genz-nickname-patterns data', () => {
  it('NICKNAME_TEMPLATES has all 6 styles', () => {
    expect(NICKNAME_TEMPLATES['social-handle'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['jp-suffix'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['kr-suffix'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['cute'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['meme'].length).toBeGreaterThan(0);
    expect(NICKNAME_TEMPLATES['english-viet'].length).toBeGreaterThan(0);
  });

  it('word lists are non-empty', () => {
    expect(CUTE_ANIMALS.length).toBeGreaterThanOrEqual(10);
    expect(CUTE_FOODS.length).toBeGreaterThanOrEqual(10);
    expect(MEME_PHRASES.length).toBeGreaterThanOrEqual(4);
    expect(FUNNY_TITLES.length).toBeGreaterThanOrEqual(5);
    expect(WESTERN_MALE.length).toBeGreaterThanOrEqual(10);
    expect(WESTERN_FEMALE.length).toBeGreaterThanOrEqual(10);
    expect(JP_SUFFIXES.length).toBeGreaterThanOrEqual(4);
    expect(KR_SUFFIXES.length).toBeGreaterThanOrEqual(4);
    expect(HANDLE_PREFIXES.length).toBeGreaterThanOrEqual(5);
  });

  it('CULTURAL_NOTES has all 6 styles', () => {
    expect(CULTURAL_NOTES['social-handle']).toBeTruthy();
    expect(CULTURAL_NOTES['jp-suffix']).toBeTruthy();
    expect(CULTURAL_NOTES['kr-suffix']).toBeTruthy();
    expect(CULTURAL_NOTES['cute']).toBeTruthy();
    expect(CULTURAL_NOTES['meme']).toBeTruthy();
    expect(CULTURAL_NOTES['english-viet']).toBeTruthy();
  });
});
