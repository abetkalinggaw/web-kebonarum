/**
 * Seed script — Adds 40 Anak-anak, 40 Pemuda, and 40 Adiyuswa to jemaat.json
 * Run: node scripts/seedBulkKomisi.js
 */

const fs = require('fs');
const path = require('path');

const JEMAAT_PATH = path.join(__dirname, '../backend/data/jemaat.json');

const namaDepanPria = ['Budi','Agus','Eko','Hendra','Joko','Bambang','Sigit','Danu','Wahyu','Fajar','Rudi','Tono','Yusuf','Ahmad','David','Samuel','Timotius','Lukas','Paulus','Yohanes','Markus','Kristian','Stefanus','Nathanael','Petrus','Rizky','Dimas','Andi','Ferry','Gilang','Kevin','Daniel','Christian','Jonathan','Gabriel','Michael','Joshua','Gideon','Benyamin','Jeremia'];
const namaDepanWanita = ['Sri','Sari','Dewi','Rina','Yuni','Ani','Wati','Lestari','Fitri','Nisa','Maria','Yohana','Kristina','Elisabeth','Ruth','Debora','Sarah','Hana','Ester','Marta','Rini','Lina','Endah','Retno','Asih','Wahyu','Desi','Tuti','Nurul','Ayu','Angelica','Grace','Joy','Priscilla','Rachel','Rebecca','Siti','Tri','Utami','Vivi'];
const namaBelakang = ['Santoso','Wijaya','Susanto','Prasetyo','Kurniawan','Setiawan','Hartono','Nugroho','Suryadi','Kusuma','Handoko','Wibowo','Gunawan','Supriyanto','Rahardjo','Kristanto','Budiman','Saputra','Purnomo','Hermawan','Laksono','Irawan','Firmansyah','Hadipranoto','Mulyono','Utomo','Pratama','Wicaksono','Prakoso','Nugraha'];

const wilayah = ['Sumberejo','Krosok','Pluneng','Ngrundul','Prayan'];
const kota = ['Klaten','Surakarta','Yogyakarta','Semarang','Magelang','Boyolali'];
const desa = ['Kebonarum','Sumberejo','Krosok','Pluneng','Ngrundul','Prayan','Gayamprit','Duwet','Barepan','Tegalrejo'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (n, len = 2) => String(n).padStart(len, '0');

const randomDate = (startYear, endYear) => {
  const y = randInt(startYear, endYear);
  const m = randInt(1, 12);
  const d = randInt(1, 28);
  return `${y}-${pad(m)}-${pad(d)}`;
};

const randomPhone = () => {
  const prefix = rand(['0812','0813','0815','0818','0821','0822','0857','0858','0877','0878']);
  return prefix + randInt(10000000, 99999999);
};

const randomNIK = (birthDate) => {
  const provinsi = '33'; // Jawa Tengah
  const kab = '10';
  const kec = pad(randInt(1, 20), 2);
  const [y, m, d] = birthDate.split('-');
  return `${provinsi}${kab}${kec}${d}${m}${y.slice(2)}${randInt(1000, 9999)}`;
};

const randomNoKK = () => '33100' + randInt(100000000000, 999999999999);
const jalan = (d) => `Desa ${d} RT ${pad(randInt(1,5), 2)}/RW ${pad(randInt(1,8), 2)}, Klaten`;

let existing = JSON.parse(fs.readFileSync(JEMAAT_PATH, 'utf-8'));
let counter = existing.length + 1;

const generated = [];

// --- 1. Anak-anak (40 members) ---
for (let i = 0; i < 40; i++) {
  const isFemale = Math.random() > 0.5;
  const namaDepan = isFemale ? rand(namaDepanWanita) : rand(namaDepanPria);
  const belakang = rand(namaBelakang);
  const namaLengkap = `${namaDepan} ${belakang}`;
  const birthYear = randInt(2013, 2022);
  const tanggalLahir = randomDate(birthYear, birthYear);
  const jenisKelamin = isFemale ? 'Perempuan' : 'Laki-laki';
  const desaAsal = rand(desa);
  const wil = rand(wilayah);
  const baptisYear = birthYear + randInt(0, 1);

  generated.push({
    id: `jmt_anak_${pad(i + 1, 3)}`,
    namaLengkap,
    nik: randomNIK(tanggalLahir),
    tempatLahir: rand(kota),
    tanggalLahir,
    jenisKelamin,
    alamat: jalan(desaAsal),
    noHp: randomPhone(),
    tanggalBaptis: `${baptisYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalSidi: '',
    tanggalNikah: '',
    statusKeanggotaan: 'Aktif',
    namaKepalaKeluarga: `${rand(namaDepanPria)} ${belakang}`,
    statusKeluarga: 'Anak',
    noKK: randomNoKK(),
    komisi: 'Komisi Anak',
    wilayah: wil,
    jabatanPelayanan: rand(['Anak Sekolah Minggu', 'Pengajar Cilik', 'Tim Musik Anak Sekolah Minggu', 'Anggota Sekolah Minggu']),
    talentaKeahlian: rand(['Bernyanyi', 'Menggambar', 'Menari & Gerak Lagu', 'Bermain Piano Anak', 'Mewarnai & Seni']),
    peranGereja: 'Jemaat',
    subPeran: '',
    gelar: '',
    pendidikan: '',
    periodeJabatan: '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  });
}

// --- 2. Pemuda (40 members) ---
for (let i = 0; i < 40; i++) {
  const isFemale = Math.random() > 0.5;
  const namaDepan = isFemale ? rand(namaDepanWanita) : rand(namaDepanPria);
  const belakang = rand(namaBelakang);
  const namaLengkap = `${namaDepan} ${belakang}`;
  const birthYear = randInt(1998, 2008);
  const tanggalLahir = randomDate(birthYear, birthYear);
  const jenisKelamin = isFemale ? 'Perempuan' : 'Laki-laki';
  const desaAsal = rand(desa);
  const wil = rand(wilayah);
  const baptisYear = birthYear + randInt(0, 3);
  const sidiYear = birthYear + randInt(15, 17);

  generated.push({
    id: `jmt_pemuda_${pad(i + 1, 3)}`,
    namaLengkap,
    nik: randomNIK(tanggalLahir),
    tempatLahir: rand(kota),
    tanggalLahir,
    jenisKelamin,
    alamat: jalan(desaAsal),
    noHp: randomPhone(),
    tanggalBaptis: `${baptisYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalSidi: `${sidiYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalNikah: '',
    statusKeanggotaan: 'Aktif',
    namaKepalaKeluarga: isFemale ? `${rand(namaDepanPria)} ${belakang}` : namaLengkap,
    statusKeluarga: rand(['Anak', 'Kepala Keluarga']),
    noKK: randomNoKK(),
    komisi: i % 4 === 0 ? 'Komisi Remaja' : 'Komisi Pemuda',
    wilayah: wil,
    jabatanPelayanan: rand([
      'Pengurus Komisi Pemuda',
      'Tim Musisi / Keyboardist',
      'Tim Multimedia & Live Stream',
      'Pengajar Sekolah Minggu',
      'Vocalist & Praise Leader',
      'Tim Creative & Media Sosial',
    ]),
    talentaKeahlian: rand([
      'Musik / Gitar / Keyboard',
      'Kamera & Videografi',
      'IT & Sound System',
      'Vokal / Singer',
      'Desain Grafis & Animation',
      'Event Organizer & MC',
    ]),
    peranGereja: 'Jemaat',
    subPeran: '',
    gelar: '',
    pendidikan: '',
    periodeJabatan: '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  });
}

// --- 3. Adiyuswa (40 members) ---
for (let i = 0; i < 40; i++) {
  const isFemale = Math.random() > 0.5;
  const namaDepan = isFemale ? rand(namaDepanWanita) : rand(namaDepanPria);
  const belakang = rand(namaBelakang);
  const namaLengkap = `${namaDepan} ${belakang}`;
  const birthYear = randInt(1945, 1964);
  const tanggalLahir = randomDate(birthYear, birthYear);
  const jenisKelamin = isFemale ? 'Perempuan' : 'Laki-laki';
  const desaAsal = rand(desa);
  const wil = rand(wilayah);
  const baptisYear = birthYear + randInt(0, 5);
  const sidiYear = birthYear + randInt(15, 18);
  const nikahYear = birthYear + randInt(22, 28);

  generated.push({
    id: `jmt_adiyuswa_${pad(i + 1, 3)}`,
    namaLengkap,
    nik: randomNIK(tanggalLahir),
    tempatLahir: rand(kota),
    tanggalLahir,
    jenisKelamin,
    alamat: jalan(desaAsal),
    noHp: randomPhone(),
    tanggalBaptis: `${baptisYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalSidi: `${sidiYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalNikah: `${nikahYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    statusKeanggotaan: i % 10 === 0 ? 'Emeritus' : 'Aktif',
    namaKepalaKeluarga: jenisKelamin === 'Laki-laki' ? namaLengkap : `${rand(namaDepanPria)} ${belakang}`,
    statusKeluarga: jenisKelamin === 'Laki-laki' ? 'Kepala Keluarga' : rand(['Istri', 'Orang Tua']),
    noKK: randomNoKK(),
    komisi: 'Komisi Adiyuswa',
    wilayah: wil,
    jabatanPelayanan: rand([
      'Anggota Komisi Adiyuswa',
      'Tim Doa Syafaat Jemaat',
      'Penasihat Komisi',
      'Paduan Suara Adiyuswa',
      'Pengurus Adiyuswa Wilayah',
    ]),
    talentaKeahlian: rand([
      'Doa Syafaat',
      'Konseling Pastoral & Pendampingan',
      'Kerajinan & Membatik',
      'Menyanyi Paduan Suara',
      'Memasak & Kuliner Tradisional',
    ]),
    peranGereja: 'Jemaat',
    subPeran: '',
    gelar: '',
    pendidikan: '',
    periodeJabatan: '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  });
}

// Merge with existing
const merged = [...existing, ...generated];
fs.writeFileSync(JEMAAT_PATH, JSON.stringify(merged, null, 2));

console.log(`✅ Bulk insertion complete!`);
console.log(`   Previous total : ${existing.length}`);
console.log(`   Added Anak-anak: 40`);
console.log(`   Added Pemuda   : 40`);
console.log(`   Added Adiyuswa : 40`);
console.log(`   New Total      : ${merged.length} records`);
