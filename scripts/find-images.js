const https = require('https');

function searchImage(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/ngetty/v3/search/images?query=${encodeURIComponent(query)}&page=1&per_page=1`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data.substring(0, 500));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'linen coord set women',
    'chikankari kurta women',
    'satin blouse women',
    'wide leg trousers women',
    'saree women',
    'ribbed top women',
    'handbag',
    'maxi skirt women',
    'anarkali suit'
  ];
  for (const q of queries) {
    console.log(`Searching for: ${q}`);
    const res = await searchImage(q);
    console.log(res);
  }
}

run();
