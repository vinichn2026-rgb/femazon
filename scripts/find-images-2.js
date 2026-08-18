const https = require('https');

function searchImage(query) {
  return new Promise((resolve, reject) => {
    const q = query.replace(/ /g, '-');
    https.get(`https://unsplash.com/s/photos/${q}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/);
        if (match) {
          resolve(match[0]);
        } else {
          resolve("Not found");
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'linen co-ord women',
    'white ethnic kurta women',
    'satin blouse fashion women',
    'wide leg trousers women',
  ];
  for (const q of queries) {
    const res = await searchImage(q);
    console.log(`${q}: ${res}`);
  }
}

run();
