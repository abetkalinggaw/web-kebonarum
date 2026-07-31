const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readStore = (name) => {
  try {
    const file = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error(`[jsonStore] Read error for ${name}:`, error.message);
    return [];
  }
};

const writeStore = (name, data) => {
  try {
    const file = path.join(dataDir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn(`[jsonStore] Write skipped for ${name} (serverless read-only mode):`, error.message);
  }
};

module.exports = { readStore, writeStore };
