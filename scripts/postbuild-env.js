require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const path = require('path');
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const content = `window.env = { API_URL: "${apiUrl}" }\n`;
fs.writeFileSync(path.join(outDir, 'env.js'), content);
console.log('Generated out/env.js with API_URL:', apiUrl); 