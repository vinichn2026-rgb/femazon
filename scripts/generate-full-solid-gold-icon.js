const sharp = require('sharp');
const path = require('path');

async function generateFullSolidGoldIcon() {
  const inputPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-full-gold-preview.png');
  const artifactPreview = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_full_gold_preview.png';

  console.log('Generating fully filled golden icon from:', inputPath);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const iconBoundaryX = 478;

  // Solid Radiant 24K Warm Gold: RGB(208, 158, 52)
  const solidGoldR = 208;
  const solidGoldG = 158;
  const solidGoldB = 52;

  // Deep Royal Maroon for FEMAZON wordmark: RGB(74, 21, 19)
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // Step 1: Detect strokes and letterforms
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

  // Step 2: Flood-fill outer background from image corners
  const isExterior = new Uint8Array(width * height);
  const queue = [0, width - 1, (height - 1) * width, height * width - 1];
  for (const q of queue) isExterior[q] = 1;

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    const cx = cur % width;
    const cy = Math.floor(cur / width);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < iconBoundaryX && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!isExterior[nidx] && iconStroke[nidx] < 0.2) {
          isExterior[nidx] = 1;
          queue.push(nidx);
        }
      }
    }
  }

  // Step 3: Dilation & Solid Gold Silhouette Fill
  const solidIcon = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < iconBoundaryX; x++) {
      const idx = y * width + x;
      if (!isExterior[idx]) {
        solidIcon[idx] = 1.0;
      } else if (iconStroke[idx] > 0.05) {
        solidIcon[idx] = Math.min(1, iconStroke[idx] * 1.5);
      }
    }
  }

  // Morphological smoothing to make full solid silhouette smooth & bold
  const smoothSolid = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < iconBoundaryX; x++) {
      const idx = y * width + x;
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= iconBoundaryX) continue;
          sum += solidIcon[ny * width + nx];
          count++;
        }
      }
      smoothSolid[idx] = sum / count;
    }
  }

  // Step 4: Render Composite
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const goldAlpha = smoothSolid[idx];

        if (goldAlpha > 0.08) {
          // Subtle metallic gradient for solid gold body
          const gradFactor = 0.92 + 0.15 * (y / height);
          const r = Math.min(255, Math.round(solidGoldR * gradFactor));
          const g = Math.min(255, Math.round(solidGoldG * gradFactor));
          const b = Math.min(255, Math.round(solidGoldB * gradFactor));

          const finalR = Math.round(255 - goldAlpha * (255 - r));
          const finalG = Math.round(255 - goldAlpha * (255 - g));
          const finalB = Math.round(255 - goldAlpha * (255 - b));

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
    .toFile(artifactPreview);

  console.log('Saved fully filled gold preview to:', previewPath);
}

generateFullSolidGoldIcon().catch(console.error);
