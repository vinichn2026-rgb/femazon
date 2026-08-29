const fs = require('fs');
const path = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\312f458b-4169-45fa-b902-8a79091e04f2\\.system_generated\\steps\\130\\content.md';
const html = fs.readFileSync(path, 'utf8');

const regex = /<a class="group"[^>]*href="([^"]+)"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/gs;
let match;
const items = [];
while ((match = regex.exec(html)) !== null) {
  items.push({
    href: match[1],
    img: match[2],
    title: match[3].replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim()
  });
}

console.log(JSON.stringify(items, null, 2));
