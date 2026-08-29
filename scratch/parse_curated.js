const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\312f458b-4169-45fa-b902-8a79091e04f2\\.system_generated\\steps\\130\\content.md', 'utf8');

const idx = html.indexOf('Curated By Aza');
const block = html.substring(idx, idx + 6000);

const regex = /"image":"([^"]+)".*?"headingText":"([^"]+)".*?"bannerLink":"([^"]+)"/g;
let m;
const list = [];
while ((m = regex.exec(block)) !== null) {
  list.push({ image: m[1], title: m[2], link: m[3] });
}

console.log(JSON.stringify(list, null, 2));
