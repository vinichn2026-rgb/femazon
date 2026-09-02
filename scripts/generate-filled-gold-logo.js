const sharp = require('sharp');
const path = require('path');

async function generateFilledGoldPreview() {
  const inputPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-gold-filled-preview.png');
  const artifactPreview = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_gold_filled_preview.png';

  console.log('Generating gold-filled preview from:', inputPath);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const iconBoundaryX = 478;

  // Rich Warm 24K Gold Fill: RGB(220, 175, 78) / Accent RGB(196, 148, 55)
  const goldFillR = 218;
  const goldFillG = 172;
  const goldFillB = 75;

  const goldStrokeR = 180;
  const goldStrokeG = 132;
  const goldStrokeB = 40;

  // Solid Deep Royal Maroon for FEMAZON: RGB(74, 21, 19)
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // Step 1: Extract icon strokes
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

  // Step 2: Flood-fill outer background from (0,0) to find the exterior in the icon bounding box
  // Everything non-exterior and inside the icon bounding area will be treated as the filled shape!
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

  // Step 3: Icon filled body mask
  const iconFill = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < iconBoundaryX; x++) {
      const idx = y * width + x;
      if (!isExterior[idx]) {
        iconFill[idx] = 1.0;
      }
    }
  }

  // Bold strokes around the icon boundary
  const boldStroke = new Float32Array(width * height);
  const radius = 2.0;

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
          if (Math.sqrt(dx * dx + dy * dy) <= radius) {
            const val = iconStroke[ny * width + nx];
            if (val > maxVal) maxVal = val;
          }
        }
      }
      boldStroke[idx] = Math.min(1, maxVal * 1.3);
    }
  }

  // Step 4: Render Composite
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const fillVal = iconFill[idx];
        const strokeVal = boldStroke[idx];

        if (strokeVal > 0.1) {
          // Darker Rich Gold Stroke for definition
          const finalR = Math.round(255 - strokeVal * (255 - goldStrokeR));
          const finalG = Math.round(255 - strokeVal * (255 - goldStrokeG));
          const finalB = Math.round(255 - strokeVal * (255 - goldStrokeB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else if (fillVal > 0.5) {
          // Radiant Glowing Warm Gold Fill with subtle vertical metallic gradient
          const gradFactor = 0.9 + 0.2 * (y / height);
          const finalR = Math.min(255, Math.round(goldFillR * gradFactor));
          const finalG = Math.min(255, Math.round(goldFillG * gradFactor));
          const finalB = Math.min(255, Math.round(goldFillB * gradFactor));

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

  console.log('Saved preview to:', previewPath);
}

generateFilledGoldPreview().catch(console.error);
