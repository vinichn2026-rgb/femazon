const sharp = require('sharp');
const path = require('path');

async function generateFaceOnlyGoldFill() {
  const originalLogoPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-face-only-gold-preview.png');
  const liveLogoPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Generating logo with golden color ONLY on face profile...');

  const image = sharp(originalLogoPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const iconBoundaryX = 478;

  // Rich Warm 24K Saturated Gold: RGB(208, 158, 52)
  const goldR = 208;
  const goldG = 158;
  const goldB = 52;

  // Royal Maroon for FEMAZON: RGB(74, 21, 19)
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // Step 1: Detect icon strokes and text
  const iconStroke = new Float32Array(width * height);
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
          iconStroke[idx] = darkness;
        } else {
          wordmarkAlpha[idx] = Math.min(1, Math.max(0, (248 - luminance) / 248));
        }
      }
    }
  }

  // Step 2: Bold the line-art strokes (clean radius 1.8px) for crisp golden lines
  const boldLineArt = new Float32Array(width * height);
  const strokeRad = 1.8;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < iconBoundaryX; x++) {
      const idx = y * width + x;
      let maxVal = 0;

      for (let dy = -2; dy <= 2; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= iconBoundaryX) continue;
          if (Math.sqrt(dx * dx + dy * dy) <= strokeRad) {
            const val = iconStroke[ny * width + nx];
            if (val > maxVal) maxVal = val;
          }
        }
      }
      boldLineArt[idx] = Math.min(1, maxVal * 1.35);
    }
  }

  // Step 3: Identify Face interior region only
  // The face profile is located on the left side of the icon (x between 135 and 265, y between 230 and 560)
  // Fill only the cavity between the face contour and the first inner line
  const faceFill = new Float32Array(width * height);

  for (let y = 230; y <= 560; y++) {
    let faceLeft = -1;
    let faceInner = -1;

    for (let x = 130; x < 290; x++) {
      const idx = y * width + x;
      if (iconStroke[idx] > 0.15) {
        if (faceLeft === -1) {
          faceLeft = x;
        } else if (x > faceLeft + 6 && faceInner === -1) {
          faceInner = x;
          break;
        }
      }
    }

    if (faceLeft !== -1 && faceInner !== -1 && faceInner - faceLeft < 110) {
      for (let x = faceLeft; x <= faceInner; x++) {
        faceFill[y * width + x] = 1.0;
      }
    }
  }

  // Step 4: Render Composite
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const isFaceSolid = faceFill[idx];
        const lineAlpha = boldLineArt[idx];

        if (isFaceSolid > 0.5 || lineAlpha > 0.05) {
          const effectiveAlpha = isFaceSolid > 0.5 ? 1.0 : lineAlpha;

          const finalR = Math.round(255 - effectiveAlpha * (255 - goldR));
          const finalG = Math.round(255 - effectiveAlpha * (255 - goldG));
          const finalB = Math.round(255 - effectiveAlpha * (255 - goldB));

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
        // FEMAZON Wordmark - Pure Solid Maroon
        const textA = wordmarkAlpha[idx];
        if (textA > 0.04) {
          const boost = Math.pow(textA, 0.8);
          const finalR = Math.round(255 - boost * (255 - maroonR));
          const finalG = Math.round(255 - boost * (255 - maroonG));
          const finalB = Math.round(255 - boost * (255 - maroonB));

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
    .toFile(previewPath);

  await sharp(outputBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ quality: 100 })
    .toFile(liveLogoPath);

  console.log('Saved face-only gold fill logo to:', previewPath, 'and', liveLogoPath);
}

generateFaceOnlyGoldFill().catch(console.error);
