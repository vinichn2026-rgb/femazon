const sharp = require('sharp');
const path = require('path');

async function generateExactLogo() {
  const inputPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const outputPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Generating exact logo from:', inputPath);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Exact boundary between Icon and Wordmark:
  // Icon is from x=139 to x=467
  // Wordmark "FEMAZON" (starting with 'F') is from x=490 to x=1245
  const iconBoundaryX = 478;

  // Rich Saturated Warm 24K Gold for Icon: RGB(196, 148, 55)
  const goldR = 196;
  const goldG = 148;
  const goldB = 55;

  // Solid Deep Royal Maroon for ENTIRE "FEMAZON" wordmark (including F): RGB(74, 21, 19) -> #4A1513
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // Step 1: Separate Icon mask and Wordmark mask
  const isIcon = new Float32Array(width * height);
  const wordmarkAlpha = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcOffset = idx * channels;

      const r = data[srcOffset];
      const g = data[srcOffset + 1];
      const b = data[srcOffset + 2];

      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      if (luminance < 250) {
        const darkness = (250 - luminance) / 250;
        if (x < iconBoundaryX) {
          // Left portion (x < 478): The Icon
          isIcon[idx] = darkness;
        } else {
          // Right portion (x >= 478): The entire "FEMAZON" wordmark starting from 'F'
          wordmarkAlpha[idx] = Math.min(1, Math.max(0, (248 - luminance) / 248));
        }
      }
    }
  }

  // Step 2: Dilation / Bolding applied ONLY to the Golden Icon (radius = 2.5px)
  const boldIcon = new Float32Array(width * height);
  const radius = 2.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (x >= iconBoundaryX) continue;

      let maxVal = 0;
      for (let dy = -3; dy <= 3; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -3; dx <= 3; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= iconBoundaryX) continue;
          
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= radius) {
            const val = isIcon[ny * width + nx];
            if (val > maxVal) maxVal = val;
          }
        }
      }
      boldIcon[idx] = Math.min(1, maxVal * 1.45);
    }
  }

  // Step 3: Composite image (Bold Gold Icon on left + Pure Solid Maroon "FEMAZON" on right)
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        // Icon Region - Bold warm 24K gold
        const iconA = boldIcon[idx];
        if (iconA > 0.04) {
          const finalR = Math.round(255 - iconA * (255 - goldR));
          const finalG = Math.round(255 - iconA * (255 - goldG));
          const finalB = Math.round(255 - iconA * (255 - goldB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else {
          outputBuffer[dstOffset] = 255;
          outputBuffer[dstOffset + 1] = 255;
          outputBuffer[dstOffset + 2] = 255;
          outputBuffer[dstOffset + 3] = 255;
        }
      } else {
        // Wordmark Region - 100% Solid Deep Royal Maroon for the whole word "FEMAZON" (starting from F)
        const textA = wordmarkAlpha[idx];
        if (textA > 0.04) {
          const boosted = Math.pow(textA, 0.8);
          const finalR = Math.round(255 - boosted * (255 - maroonR));
          const finalG = Math.round(255 - boosted * (255 - maroonG));
          const finalB = Math.round(255 - boosted * (255 - maroonB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else {
          outputBuffer[dstOffset] = 255;
          outputBuffer[dstOffset + 1] = 255;
          outputBuffer[dstOffset + 2] = 255;
          outputBuffer[dstOffset + 3] = 255;
        }
      }
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

  console.log('Successfully generated exact logo at:', outputPath);
}

generateExactLogo().catch(console.error);
