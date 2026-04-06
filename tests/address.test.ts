import { describe, it, expect } from 'vitest';
import {
  addressCalculate,
  pronounPairGet,
  EGender,
  ERegion,
  EFormality,
  EHonorificCategory,
} from '../src/index';

describe('addressCalculate', () => {
  describe('age-based address', () => {
    it('addresses much older male as Ông', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        speakerAge: 25,
        addresseeAge: 60,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Ông');
      expect(result.addressTerm).toBe('Ông Minh');
      expect(result.pronounPair.self).toBe('con');
      expect(result.pronounPair.addressee).toBe('ông');
      expect(result.category).toBe(EHonorificCategory.AgeBased);
    });

    it('addresses much older female as Bà', () => {
      const result = addressCalculate('Trần Thị Lan', {
        speakerAge: 20,
        addresseeAge: 55,
        gender: EGender.Female,
      });
      expect(result.honorific).toBe('Bà');
      expect(result.addressTerm).toBe('Bà Lan');
      expect(result.pronounPair.self).toBe('con');
    });

    it('addresses parent-generation male as Chú', () => {
      const result = addressCalculate('Lê Đức Hùng', {
        speakerAge: 20,
        addresseeAge: 35,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Chú');
      expect(result.pronounPair.self).toBe('cháu');
      expect(result.pronounPair.addressee).toBe('chú');
    });

    it('addresses parent-generation female as Cô', () => {
      const result = addressCalculate('Phạm Ngọc Mai', {
        speakerAge: 20,
        addresseeAge: 35,
        gender: EGender.Female,
      });
      expect(result.honorific).toBe('Cô');
      expect(result.pronounPair.self).toBe('cháu');
    });

    it('addresses slightly older male as Anh', () => {
      const result = addressCalculate('Nguyễn Minh Tuấn', {
        speakerAge: 22,
        addresseeAge: 27,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Anh');
      expect(result.pronounPair.self).toBe('em');
      expect(result.pronounPair.addressee).toBe('anh');
    });

    it('addresses slightly older female as Chị', () => {
      const result = addressCalculate('Trần Thảo Linh', {
        speakerAge: 22,
        addresseeAge: 27,
        gender: EGender.Female,
      });
      expect(result.honorific).toBe('Chị');
      expect(result.pronounPair.self).toBe('em');
    });

    it('applies nâng principle for same-age (defaults to older-status)', () => {
      const result = addressCalculate('Nguyễn Văn Bình', {
        speakerAge: 25,
        addresseeAge: 25,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Anh');
      expect(result.pronounPair.self).toBe('em');
    });

    it('addresses younger person as Em', () => {
      const result = addressCalculate('Lê Minh Khoa', {
        speakerAge: 30,
        addresseeAge: 25,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Em');
      expect(result.pronounPair.self).toBe('anh');
      expect(result.pronounPair.addressee).toBe('em');
    });

    it('addresses much younger person as Con', () => {
      const result = addressCalculate('Trần Gia Bảo', {
        speakerAge: 50,
        addresseeAge: 10,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Con');
      expect(result.pronounPair.self).toBe('ông');
    });
  });

  describe('regional variants', () => {
    it('uses O instead of Cô for Central region', () => {
      const result = addressCalculate('Nguyễn Thị Hương', {
        speakerAge: 20,
        addresseeAge: 35,
        gender: EGender.Female,
        region: ERegion.Central,
      });
      expect(result.honorific).toBe('O');
      expect(result.region).toBe(ERegion.Central);
    });
  });

  describe('professional titles', () => {
    it('addresses a doctor as Bác sĩ', () => {
      const result = addressCalculate('Nguyễn Văn An', {
        role: 'doctor',
      });
      expect(result.honorific).toBe('Bác sĩ');
      expect(result.addressTerm).toBe('Bác sĩ An');
      expect(result.category).toBe(EHonorificCategory.Professional);
    });

    it('addresses a professor as Giáo sư', () => {
      const result = addressCalculate('Trần Minh Đức', {
        role: 'professor',
      });
      expect(result.honorific).toBe('Giáo sư');
      expect(result.addressTerm).toBe('Giáo sư Đức');
    });

    it('addresses a general as Đại tướng', () => {
      const result = addressCalculate('Võ Nguyên Giáp', {
        role: 'general',
      });
      expect(result.honorific).toBe('Đại tướng');
      expect(result.addressTerm).toBe('Đại tướng Giáp');
    });

    it('addresses a lawyer as Luật sư', () => {
      const result = addressCalculate('Phạm Thị Hoa', {
        role: 'lawyer',
      });
      expect(result.honorific).toBe('Luật sư');
      expect(result.addressTerm).toBe('Luật sư Hoa');
    });

    it('role takes priority over age', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        role: 'doctor',
        speakerAge: 50,
        addresseeAge: 25,
      });
      expect(result.honorific).toBe('Bác sĩ');
      expect(result.category).toBe(EHonorificCategory.Professional);
    });
  });

  describe('formality levels', () => {
    it('written formal prepends Kính gửi', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        formality: EFormality.WrittenFormal,
        gender: EGender.Male,
      });
      expect(result.fullAddress).toBe('Kính gửi Ông Minh');
    });

    it('spoken formal prepends Thưa', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        formality: EFormality.SpokenFormal,
        gender: EGender.Male,
      });
      expect(result.fullAddress).toBe('Thưa Ông Minh');
    });

    it('intimate uses name + ơi', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        formality: EFormality.Intimate,
        gender: EGender.Male,
      });
      expect(result.fullAddress).toBe('Minh ơi');
    });

    it('casual uses honorific + name', () => {
      const result = addressCalculate('Nguyễn Văn Minh', {
        formality: EFormality.Casual,
        gender: EGender.Male,
      });
      expect(result.fullAddress).toBe('Anh Minh');
    });
  });

  describe('fallback behavior', () => {
    it('auto-detects gender from Văn middle name', () => {
      const result = addressCalculate('Nguyễn Văn Nam');
      expect(result.honorific).toBe('Anh');
    });

    it('auto-detects gender from Thị middle name', () => {
      const result = addressCalculate('Trần Thị Mai');
      expect(result.honorific).toBe('Chị');
    });

    it('uses given name for address, not surname', () => {
      const result = addressCalculate('Nguyễn Văn Minh');
      expect(result.addressTerm).toContain('Minh');
      expect(result.addressTerm).not.toContain('Nguyễn');
    });
  });

  describe('one person, five ways', () => {
    const name = 'Nguyễn Văn Minh';

    it('much older speaker addresses as Con (grandparent gen)', () => {
      const result = addressCalculate(name, {
        speakerAge: 60,
        addresseeAge: 35,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Con');
      expect(result.pronounPair.self).toBe('ông');
      expect(result.pronounPair.addressee).toBe('con');
    });

    it('younger employee addresses as Anh', () => {
      const result = addressCalculate(name, {
        speakerAge: 28,
        addresseeAge: 35,
        gender: EGender.Male,
      });
      expect(result.honorific).toBe('Anh');
      expect(result.pronounPair.self).toBe('em');
    });

    it('written formal addresses as Ông', () => {
      const result = addressCalculate(name, {
        formality: EFormality.WrittenFormal,
        gender: EGender.Male,
      });
      expect(result.fullAddress).toBe('Kính gửi Ông Minh');
    });
  });
});

describe('pronounPairGet', () => {
  it('returns em/anh for slightly older male', () => {
    const pair = pronounPairGet(22, 27, { gender: EGender.Male });
    expect(pair.self).toBe('em');
    expect(pair.addressee).toBe('anh');
  });

  it('returns em/chị for slightly older female', () => {
    const pair = pronounPairGet(22, 27, { gender: EGender.Female });
    expect(pair.self).toBe('em');
    expect(pair.addressee).toBe('chị');
  });

  it('returns con/ông for much older male', () => {
    const pair = pronounPairGet(20, 60, { gender: EGender.Male });
    expect(pair.self).toBe('con');
    expect(pair.addressee).toBe('ông');
  });

  it('returns anh/em for younger male', () => {
    const pair = pronounPairGet(30, 24, { gender: EGender.Male });
    expect(pair.self).toBe('anh');
    expect(pair.addressee).toBe('em');
  });

  it('defaults to North region', () => {
    const pair = pronounPairGet(20, 35, { gender: EGender.Female });
    expect(pair.self).toBe('cháu');
    expect(pair.addressee).toBe('cô');
  });

  it('uses regional variant for Central', () => {
    const pair = pronounPairGet(20, 35, {
      gender: EGender.Female,
      region: ERegion.Central,
    });
    expect(pair.addressee).toBe('o');
  });

  it('handles same age with nâng principle', () => {
    const pair = pronounPairGet(25, 25, { gender: EGender.Male });
    expect(pair.self).toBe('em');
    expect(pair.addressee).toBe('anh');
  });
});
