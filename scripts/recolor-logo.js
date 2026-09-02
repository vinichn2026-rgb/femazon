const sharp = require('sharp');
const path = require('path');

async function recolorLogo() {
  const inputPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const outputPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Reading input image from:', inputPath);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  console.log(`Image info: ${width}x${height}, channels: ${channels}`);

  // Target Maroon Color: #4A1513 -> RGB(74, 21, 19)
  const targetR = 74;
  const targetG = 21;
  const targetB = 19;

  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcOffset = i * channels;
    const dstOffset = i * 4;

    const r = data[srcOffset];
    const g = data[srcOffset + 1];
    const b = data[srcOffset + 2];

    // Calculate luminance (0 = black, 255 = white)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luminance >= 250) {
      // Pure White Background
      outputBuffer[dstOffset] = 255;
      outputBuffer[dstOffset + 1] = 255;
      outputBuffer[dstOffset + 2] = 255;
      outputBuffer[dstOffset + 3] = 255;
    } else {
      // Artwork stroke - antialiased blending into maroon
      const darkness = Math.min(1, Math.max(0, (250 - luminance) / 250));
      // Increase contrast curve slightly for crisp boldness
      const boostedDarkness = Math.pow(darkness, 0.7);

      const newR = Math.round(255 - boostedDarkness * (255 - targetR));
      const newG = Math.round(255 - boostedDarkness * (255 - targetG));
      const newB = Math.round(255 - boostedDarkness * (255 - targetB));

      outputBuffer[dstOffset] = newR;
      outputBuffer[dstOffset + 1] = newG;
      outputBuffer[dstOffset + 2] = newB;
      outputBuffer[dstOffset + 3] = 255;
    }
  }

  await sharp(outputBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Successfully saved crisp maroon logo to:', outputPath);
}

recolorLogo().catch(console.error);
