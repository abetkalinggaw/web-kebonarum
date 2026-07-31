/**
 * Seed script — generates 20 randomized jemaat records per role category
 * Roles: Pendeta (5), Majelis Penatua (20), Majelis Diaken (20), Jemaat (20)
 * Run: node scripts/seedJemaat.js
 */

const fs = require('fs');
const path = require('path');

const JEMAAT_PATH = path.join(__dirname, '../backend/data/jemaat.json');

// --- Indonesian name pools ---
const namaDepanPria = ['Budi','Agus','Eko','Hendra','Joko','Bambang','Sigit','Danu','Wahyu','Fajar','Rudi','Tono','Yusuf','Ahmad','David','Samuel','Timotius','Lukas','Paulus','Yohanes','Markus','Kristian','Stefanus','Nathanael','Petrus','Rizky','Dimas','Andi','Ferry','Gilang'];
const namaDepanWanita = ['Sri','Sari','Dewi','Rina','Yuni','Ani','Wati','Lestari','Fitri','Nisa','Maria','Yohana','Kristina','Elisabeth','Ruth','Debora','Sarah','Hana','Ester','Marta','Rini','Lina','Endah','Retno','Asih','Wahyu','Desi','Tuti','Nurul','Ayu'];
const namaBelakang = ['Santoso','Wijaya','Susanto','Prasetyo','Kurniawan','Setiawan','Hartono','Nugroho','Suryadi','Kusuma','Handoko','Wibowo','Gunawan','Supriyanto','Rahardjo','Kristanto','Budiman','Saputra','Purnomo','Hermawan','Laksono','Irawan','Firmansyah','Hadipranoto','Mulyono'];
const namaTengah = ['','Budi ','Eko ','Heru ','Adi ','Dwi ','Tri ','Putra ','Candra ','Surya '];

const wilayah = ['Sumberejo','Krosok','Pluneng','Ngrundul','Prayan'];
const komisiList = ['Komisi Anak','Komisi Remaja','Komisi Pemuda','Komisi Dewasa','Komisi Wanita / PWG','Komisi Adiyuswa'];
const statusKeluargaOpts = ['Kepala Keluarga','Istri','Anak','Orang Tua'];
const statusKeanggotaan = ['Aktif','Aktif','Aktif','Aktif','Aktif','Aktif','Aktif','Pindah','Emeritus'];
const jabatanJemaat = ['Pengajar Sekolah Minggu','Tim Musisi','Tim Multimedia','Tim Penyambut Tamu','Tim Konsumsi','Tim Dekorasi','Tim Doa','Paduan Suara','Pengurus Komisi','Jemaat Umum'];
const talentaPria = ['Musik, Gitar','Kamera, Videografi','Komputer, IT','Olahraga','Bernyanyi, Paduan Suara','Mengajar','Pertukangan, Teknik','Desain Grafis'];
const talentaWanita = ['Memasak','Menjahit','Bernyanyi, Paduan Suara','Mengajar','Dekorasi, Seni','Tarian, Gerak & Lagu','Administrasi, Tulis','Bermain Piano'];
const pendidikanPendeta = [
  'M.Th. — Sekolah Tinggi Theologia Duta Wacana',
  'M.Div. — STT Jakarta',
  'M.Th. — STT Amanat Agung Jakarta',
  'S.Th. — Sekolah Tinggi Theologia Jaffray',
  'M.Min. — Reformed Theological Seminary',
];
const gelarPendeta = ['Pdt.','Pdm.'];
const jabatanMajelis = ['Penatua','Diaken'];
const jabatanPendeta = ['Pendeta Jemaat','Pendeta Muda','Pendeta Penginjil','Pendeta Emeritus','Vikaris'];
const periodeOptions = ['2020 – 2023','2023 – 2026','2026 – 2029'];

// --- Utility functions ---
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
  const prefix = rand(['0812','0813','0814','0815','0816','0817','0818','0819','0821','0822','0823','0852','0853','0857','0858','0877','0878']);
  return prefix + randInt(10000000, 99999999);
};

const randomNIK = (birthDate) => {
  const provinsi = '33'; // Jawa Tengah
  const kab = '10';
  const kec = pad(randInt(1, 20), 2);
  const [y, m, d] = birthDate.split('-');
  return `${provinsi}${kab}${kec}${d}${m}${y.slice(2)}${randInt(1000, 9999)}`;
};

const randomNoKK = () => {
  return '33100' + randInt(100000000000, 999999999999);
};

const kota = ['Klaten','Surakarta','Yogyakarta','Semarang','Magelang','Boyolali'];
const desa = ['Kebonarum','Sumberejo','Krosok','Pluneng','Ngrundul','Prayan','Gayamprit','Duwet','Barepan','Tegalrejo'];
const jalan = (desa) => `Desa ${desa} RT ${pad(randInt(1,5), 2)}/RW ${pad(randInt(1,8), 2)}, Klaten`;

// --- Existing data ---
let existing = JSON.parse(fs.readFileSync(JEMAAT_PATH, 'utf-8'));

// --- Generator ---
const generated = [];
let counter = existing.length + 1;

function makePerson(peranGereja, subPeran = '') {
  const isFemale = Math.random() > 0.45;
  const namaDepan = isFemale ? rand(namaDepanWanita) : rand(namaDepanPria);
  const tengah = rand(namaTengah);
  const belakang = rand(namaBelakang);
  const namaLengkap = `${namaDepan} ${tengah}${belakang}`.replace(/  +/g, ' ').trim();
  const lahirTahun = peranGereja === 'Pendeta' ? randInt(1965, 1985)
    : peranGereja === 'Majelis' ? randInt(1965, 1990)
    : isFemale ? randInt(1960, 2005) : randInt(1960, 2006);
  const tanggalLahir = randomDate(lahirTahun, lahirTahun + 3);
  const tempatLahir = rand(kota);
  const jenisKelamin = isFemale ? 'Perempuan' : 'Laki-laki';
  const desaAsal = rand(desa);
  const nik = randomNIK(tanggalLahir);
  const noHp = randomPhone();
  const alamat = jalan(desaAsal);
  const noKK = randomNoKK();
  const wil = rand(wilayah);
  const baptisYear = parseInt(tanggalLahir.split('-')[0]) + randInt(0, 6);
  const sidiYear = baptisYear + randInt(10, 18);
  const nikahYear = sidiYear + randInt(2, 10);
  const komisi = isFemale ? 'Komisi Wanita / PWG'
    : (lahirTahun > 2000 ? 'Komisi Pemuda'
    : lahirTahun > 1985 ? 'Komisi Dewasa'
    : lahirTahun > 1950 ? 'Komisi Dewasa'
    : 'Komisi Adiyuswa');

  const id = peranGereja === 'Pendeta' ? `jmt_pdt_${pad(counter, 3)}`
    : peranGereja === 'Majelis' && subPeran === 'Penatua' ? `jmt_pnt_${pad(counter, 3)}`
    : peranGereja === 'Majelis' && subPeran === 'Diaken' ? `jmt_dkn_${pad(counter, 3)}`
    : `jmt_${pad(counter, 4)}`;

  counter++;

  const base = {
    id,
    namaLengkap,
    nik,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    alamat,
    noHp,
    tanggalBaptis: `${baptisYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalSidi: `${sidiYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
    tanggalNikah: nikahYear < 2026 ? `${nikahYear}-${pad(randInt(1,12))}-${pad(randInt(1,28))}` : '',
    statusKeanggotaan: rand(statusKeanggotaan),
    namaKepalaKeluarga: jenisKelamin === 'Laki-laki' ? namaLengkap : `${rand(namaDepanPria)} ${belakang}`,
    statusKeluarga: jenisKelamin === 'Perempuan' ? rand(['Istri','Kepala Keluarga','Anak']) : rand(['Kepala Keluarga','Anak']),
    noKK,
    komisi,
    wilayah: wil,
    jabatanPelayanan: peranGereja === 'Pendeta' ? rand(jabatanPendeta)
      : peranGereja === 'Majelis' ? (subPeran || rand(['Penatua','Diaken']))
      : rand(jabatanJemaat),
    talentaKeahlian: isFemale ? rand(talentaWanita) : rand(talentaPria),
    peranGereja,
    subPeran,
    gelar: peranGereja === 'Pendeta' ? rand(gelarPendeta) : '',
    pendidikan: peranGereja === 'Pendeta' ? rand(pendidikanPendeta) : '',
    periodeJabatan: peranGereja !== 'Jemaat' ? rand(periodeOptions) : '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
  };

  return base;
}

// --- Generate counts ---
const PENDETA_COUNT = 5;
const MAJELIS_COUNT = 20;
const JEMAAT_COUNT = 20;

for (let i = 0; i < PENDETA_COUNT; i++) generated.push(makePerson('Pendeta'));
for (let i = 0; i < MAJELIS_COUNT; i++) generated.push(makePerson('Majelis', 'Penatua'));
for (let i = 0; i < MAJELIS_COUNT; i++) generated.push(makePerson('Majelis', 'Diaken'));
for (let i = 0; i < JEMAAT_COUNT; i++) generated.push(makePerson('Jemaat'));

// Merge with existing
const merged = [...existing, ...generated];
fs.writeFileSync(JEMAAT_PATH, JSON.stringify(merged, null, 2));

console.log(`✅ Seed complete!`);
console.log(`   Existing records : ${existing.length}`);
console.log(`   Added Pendeta    : ${PENDETA_COUNT}`);
console.log(`   Added Penatua    : ${MAJELIS_COUNT}`);
console.log(`   Added Diaken     : ${MAJELIS_COUNT}`);
console.log(`   Added Jemaat     : ${JEMAAT_COUNT}`);
console.log(`   Total            : ${merged.length} records`);
