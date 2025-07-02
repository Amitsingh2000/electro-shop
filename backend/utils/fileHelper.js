const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function readData(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
}

function writeData(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData,
};
