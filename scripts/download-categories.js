const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'categories');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const images = [
  { name: 'dresses.jpg', url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&h=1000&auto=format&fit=crop' },
  { name: 'ethnic.jpg', url: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?q=80&w=800&h=1000&auto=format&fit=crop' },
  { name: 'tops.jpg', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&h=1000&auto=format&fit=crop' },
  { name: 'bottoms.jpg', url: 'https://images.unsplash.com/photo-1509631179647-0c9228ebca52?q=80&w=800&h=1000&auto=format&fit=crop' },
  { name: 'coords.jpg', url: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=800&h=1000&auto=format&fit=crop' },
  { name: 'accessories.jpg', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&h=1000&auto=format&fit=crop' }
];

images.forEach(img => {
  const filePath = path.join(dir, img.name);
  const file = fs.createWriteStream(filePath);
  https.get(img.url, function(response) {
    if(response.statusCode !== 200) {
        console.error(`Failed to download ${img.url}: ${response.statusCode}`);
        return;
    }
    response.pipe(file);
    file.on('finish', function() {
      file.close(() => console.log(`Downloaded ${img.name}`));
    });
  }).on('error', function(err) {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${img.name}:`, err.message);
  });
});
