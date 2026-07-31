/**
 * Migration script — Removes 'Emeritus' status, adds statusPerkawinan, pekerjaan, kewarganegaraan
 * and reorganizes jemaat.json fields consistently.
 * Run: node scripts/updateJemaatSchema.js
 */

const fs = require('fs');
const path = require('path');

const JEMAAT_PATH = path.join(__dirname, '../backend/data/jemaat.json');

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pekerjaanPria = ['Karyawan Swasta', 'Wiraswasta', 'PNS / ASN', 'Petani / Peternak', 'Guru / Dosen', 'BUMN', 'TNI / Polri'];
const pekerjaanWanita = ['Ibu Rumah Tangga', 'Karyawan Swasta', 'Wiraswasta', 'PNS / ASN', 'Guru / Dosen', 'Bidan / Perawat'];
const pekerjaanPemuda = ['Mahasiswa', 'Karyawan Swasta', 'Wiraswasta', 'Desainer / IT', 'Pegawai Bank'];
const pekerjaanAdiyuswa = ['Pensiunan PNS', 'Pensiunan Swasta / BUMN', 'Wiraswasta', 'Ibu Rumah Tangga', 'Petani / Peternak'];

let items = JSON.parse(fs.readFileSync(JEMAAT_PATH, 'utf-8'));
let convertedEmeritusCount = 0;

const updated = items.map((item) => {
  // 1. Remove Emeritus status
  let statusKeanggotaan = item.statusKeanggotaan || 'Aktif';
  if (statusKeanggotaan === 'Emeritus') {
    statusKeanggotaan = 'Aktif';
    convertedEmeritusCount++;
  }

  // 2. Determine statusPerkawinan
  let statusPerkawinan = item.statusPerkawinan || '';
  if (!statusPerkawinan) {
    if (item.tanggalNikah && item.tanggalNikah.trim() !== '') {
      statusPerkawinan = 'Menikah';
    } else if (item.komisi === 'Komisi Anak' || item.komisi === 'Komisi Remaja') {
      statusPerkawinan = 'Belum Menikah';
    } else if (item.komisi === 'Komisi Pemuda') {
      statusPerkawinan = Math.random() > 0.88 ? 'Menikah' : 'Belum Menikah';
    } else if (item.komisi === 'Komisi Adiyuswa') {
      statusPerkawinan = Math.random() > 0.35 ? 'Menikah' : 'Janda / Duda';
    } else {
      statusPerkawinan = Math.random() > 0.15 ? 'Menikah' : 'Belum Menikah';
    }
  }

  // 3. Determine pekerjaan
  let pekerjaan = item.pekerjaan || '';
  if (!pekerjaan) {
    if (item.komisi === 'Komisi Anak' || item.komisi === 'Komisi Remaja') {
      pekerjaan = 'Pelajar';
    } else if (item.komisi === 'Komisi Pemuda') {
      pekerjaan = rand(pekerjaanPemuda);
    } else if (item.komisi === 'Komisi Adiyuswa') {
      pekerjaan = rand(pekerjaanAdiyuswa);
    } else {
      pekerjaan = item.jenisKelamin === 'Perempuan' ? rand(pekerjaanWanita) : rand(pekerjaanPria);
    }
  }

  // 4. Kewarganegaraan
  const kewarganegaraan = item.kewarganegaraan || 'WNI';

  // 5. Reorganize key order consistently
  return {
    id: item.id,
    namaLengkap: item.namaLengkap || '',
    nik: item.nik || '',
    tempatLahir: item.tempatLahir || '',
    tanggalLahir: item.tanggalLahir || '',
    jenisKelamin: item.jenisKelamin || 'Laki-laki',
    kewarganegaraan,
    statusPerkawinan,
    pekerjaan,
    alamat: item.alamat || '',
    noHp: item.noHp || '',
    tanggalBaptis: item.tanggalBaptis || '',
    tanggalSidi: item.tanggalSidi || '',
    tanggalNikah: item.tanggalNikah || '',
    statusKeanggotaan,
    namaKepalaKeluarga: item.namaKepalaKeluarga || '',
    statusKeluarga: item.statusKeluarga || 'Kepala Keluarga',
    noKK: item.noKK || '',
    komisi: item.komisi || 'Komisi Dewasa',
    wilayah: item.wilayah || 'Sumberejo',
    jabatanPelayanan: item.jabatanPelayanan || '',
    talentaKeahlian: item.talentaKeahlian || '',
    peranGereja: item.peranGereja || 'Jemaat',
    subPeran: item.subPeran || '',
    gelar: item.gelar || '',
    pendidikan: item.pendidikan || '',
    periodeJabatan: item.periodeJabatan || '',
    imageUrl: item.imageUrl || '',
    createdAt: item.createdAt || new Date().toISOString(),
  };
});

fs.writeFileSync(JEMAAT_PATH, JSON.stringify(updated, null, 2));

console.log(`✅ Schema update complete!`);
console.log(`   Total records           : ${updated.length}`);
console.log(`   Converted Emeritus      : ${convertedEmeritusCount} -> Aktif`);
console.log(`   Added statusPerkawinan  : OK`);
console.log(`   Added pekerjaan         : OK`);
console.log(`   Added kewarganegaraan   : OK`);
