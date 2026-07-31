const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readStore = (name) => {
  const file = path.join(dataDir, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

const writeStore = (name, data) => {
  const file = path.join(dataDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readStore, writeStore };
