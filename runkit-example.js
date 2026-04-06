const vn = require('vietnamese-name-generator');

// Generate a Vietnamese name
const name = vn.generate({ seed: 42 });
console.log('Generated:', name.fullName);
console.log('  Gender:', name.gender, '| Region:', name.region);

// Vietnamese address system (xưng hô)
// 25-year-old speaking to 60-year-old
const address = vn.addressCalculate('Nguyễn Văn Nam', {
  speakerAge: 25,
  addresseeAge: 60,
});
console.log('\nAddress:', address.addressTerm);
console.log('  Pronouns: self =', address.pronounPair.self, '| addressee =', address.pronounPair.addressee);

// Professional title
const doctor = vn.addressCalculate('Trần Thị Lan', { role: 'doctor' });
console.log('\nDoctor:', doctor.addressTerm);

// Parse & detect gender
const parsed = vn.parseName('Nguyễn Thị Mai Anh');
console.log('\nParsed:', parsed);

const gender = vn.detectGender('Nguyễn Thị Mai');
console.log('Gender:', gender.gender, '| Confidence:', gender.confidence);

// Hán Việt lookup
const hanViet = vn.getHanViet('Minh');
console.log('\nHán Việt "Minh":', hanViet.character, '=', hanViet.meaning);

// GenZ nickname
const nick = vn.generateGenZNickname({ name: 'Trần Thảo Linh', style: 'jp-suffix', seed: 5 });
console.log('\nGenZ nickname:', nick.nickname);
