const sharp = require('sharp');
const path = require('path');

async function generateSoftChampagneFill() {
  const inputPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-gold-filled-preview-v2.png');
  const artifactPreview = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_gold_filled_preview_v2.png';

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const iconBoundaryX = 478;

  // Soft Metallic Champagne / Rose-Gold Fill
  const fillR = 230;
  const fillG = 195;
  const fillB = 135;

  // Crisp Royal Maroon Stroke
  const strokeR = 74;
  const strokeG = 21;
  const strokeB = 19;

  // Wordmark
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

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

  // Flood fill background
  const isExterior = new Uint8Array(width * height);
  const queue = [0];
  isExterior[0] = 1;
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
        if (!isExterior[nidx] && iconStroke[nidx] < 0.25) {
          isExterior[nidx] = 1;
          queue.push(nidx);
        }
      }
    }
  }

  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const strVal = iconStroke[idx];
        const isExt = isExterior[idx];

        if (strVal > 0.08) {
          // Sharp Maroon Outline
          const boost = Math.pow(strVal, 0.75);
          const finalR = Math.round(255 - boost * (255 - strokeR));
          const finalG = Math.round(255 - boost * (255 - strokeG));
          const finalB = Math.round(255 - boost * (255 - strokeB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else if (!isExt) {
          // Soft Champagne Gold Interior Fill
          outputBuffer[dstOffset] = fillR;
          outputBuffer[dstOffset + 1] = fillG;
          outputBuffer[dstOffset + 2] = fillB;
          outputBuffer[dstOffset + 3] = 255;
        } else {
          outputBuffer[dstOffset] = 255;
          outputBuffer[dstOffset + 1] = 255;
          outputBuffer[dstOffset + 2] = 255;
          outputBuffer[dstOffset + 3] = 255;
        }
      } else {
        // Solid Maroon Text
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

  console.log('Saved V2 preview to:', previewPath);
}

generateSoftChampagneFill().catch(console.error);
