const sharp = require('sharp');
const path = require('path');

async function createMatchingEmblem() {
  const logoPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');
  const emblemPath = path.join(__dirname, '..', 'public', 'femazon-emblem.png');

  console.log('Generating matching square emblem from logo...');

  const image = sharp(logoPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Extract icon region (x: 110 to 475, y: 150 to 610)
  const extractW = 365;
  const extractH = 460;
  const extractX = 110;
  const extractY = 150;

  const iconCropped = await sharp(logoPath)
    .extract({ left: extractX, top: extractY, width: extractW, height: extractH })
    .toBuffer();

  // Create square 512x512 with white background
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: await sharp(iconCropped).resize(420, 420, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer(),
        gravity: 'center'
      }
    ])
    .png({ quality: 100 })
    .toFile(emblemPath);

  console.log('Saved matching square emblem to:', emblemPath);
}

createMatchingEmblem().catch(console.error);
