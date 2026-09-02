const sharp = require('sharp');
const path = require('path');

async function generateCompleteGaplessFaceFill() {
  const originalLogoPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-gapless-face-preview.png');
  const liveLogoPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Generating 100% gapless solid gold face fill...');

  const image = sharp(originalLogoPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const iconBoundaryX = 478;

  // Solid Rich 24K Gold for Face: RGB(214, 162, 52)
  const goldR = 214;
  const goldG = 162;
  const goldB = 52;

  // Royal Maroon for Wordmark: RGB(74, 21, 19)
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // Step 1: Detect strokes and wordmark
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

  // Step 2: Line-art strokes
  const boldHairStrokes = new Float32Array(width * height);
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
      boldHairStrokes[idx] = Math.min(1, maxVal * 1.35);
    }
  }

  // Step 3: Complete Gapless Solid Face Fill
  // Span from outer face profile contour all the way across the cheek/face to the main hair stem
  const completeFaceMask = new Float32Array(width * height);

  for (let y = 200; y <= 570; y++) {
    let leftmostX = -1;
    let rightmostFaceX = -1;

    // Find leftmost facial contour
    for (let x = 115; x < 280; x++) {
      if (iconStroke[y * width + x] > 0.12) {
        leftmostX = x;
        break;
      }
    }

    if (leftmostX !== -1) {
      // Find the hair boundary (the 2nd prominent stroke to the right)
      let foundFirstGap = false;
      for (let x = leftmostX + 4; x < 330; x++) {
        const str = iconStroke[y * width + x];
        if (!foundFirstGap && str < 0.08) {
          foundFirstGap = true;
        }
        if (foundFirstGap && str > 0.15) {
          rightmostFaceX = x;
          break;
        }
      }

      // If no 2nd stroke found in range, use proportional width
      if (rightmostFaceX === -1) {
        rightmostFaceX = leftmostX + 50;
      }

      // Fill EVERY pixel between leftmost and rightmost completely with 1.0 (zero gap)
      for (let x = leftmostX; x <= rightmostFaceX; x++) {
        completeFaceMask[y * width + x] = 1.0;
      }
    }
  }

  // Extra pass: 2D Morphological closing on face mask to guarantee 100% gapless fill
  const solidGaplessFace = new Float32Array(width * height);
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
          if (completeFaceMask[ny * width + nx] > maxVal) {
            maxVal = completeFaceMask[ny * width + nx];
          }
        }
      }
      solidGaplessFace[idx] = maxVal;
    }
  }

  // Smooth edges of the solid face
  const smoothGaplessFace = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < iconBoundaryX; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= iconBoundaryX) continue;
          sum += solidGaplessFace[ny * width + nx];
          count++;
        }
      }
      smoothGaplessFace[y * width + x] = sum / count;
    }
  }

  // Step 4: Render Composite
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const faceA = smoothGaplessFace[idx];
        const strokeA = boldHairStrokes[idx];

        if (faceA > 0.08) {
          // 100% SOLID GAPLESS GOLD FOR FACE
          const finalR = Math.round(255 - faceA * (255 - goldR));
          const finalG = Math.round(255 - faceA * (255 - goldG));
          const finalB = Math.round(255 - faceA * (255 - goldB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else if (strokeA > 0.05) {
          // Hair strands & F outline
          const finalR = Math.round(255 - strokeA * (255 - goldR));
          const finalG = Math.round(255 - strokeA * (255 - goldG));
          const finalB = Math.round(255 - strokeA * (255 - goldB));

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

  console.log('Saved 100% gapless solid gold face fill logo to:', previewPath, 'and', liveLogoPath);
}

generateCompleteGaplessFaceFill().catch(console.error);
