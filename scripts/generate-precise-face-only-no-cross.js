const sharp = require('sharp');
const path = require('path');

async function generatePreciseFaceOnly() {
  const originalLogoPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-precise-face-preview.png');
  const liveLogoPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Generating logo with gold fill restricted strictly to the face silhouette...');

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

  // Step 2: Line-art strokes (clean radius 1.8px)
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

  // Step 3: Precise Face Mask ONLY (Forehead, eye, nose, lips, chin, jawline)
  // Strictly bounded to the face cavity on the left (x between 135 and 215, y between 240 and 485)
  // All hair loops, curls, and F cavities (x > 215 or y > 485) remain 100% unfilled negative space!
  const preciseFaceMask = new Float32Array(width * height);

  for (let y = 240; y <= 485; y++) {
    // Find leftmost facial contour line
    let leftFaceX = -1;
    for (let x = 120; x < 210; x++) {
      if (iconStroke[y * width + x] > 0.12) {
        leftFaceX = x;
        break;
      }
    }

    // Find inner boundary of the face (the hair parting line, max x = 215)
    let innerFaceX = -1;
    if (leftFaceX !== -1) {
      for (let x = leftFaceX + 6; x <= 220; x++) {
        if (iconStroke[y * width + x] > 0.15) {
          innerFaceX = x;
          break;
        }
      }
      if (innerFaceX === -1) {
        innerFaceX = Math.min(215, leftFaceX + 45);
      }

      // Fill ONLY between leftFaceX and innerFaceX
      for (let x = leftFaceX; x <= innerFaceX; x++) {
        preciseFaceMask[y * width + x] = 1.0;
      }
    }
  }

  // Smooth face edges slightly
  const smoothFace = new Float32Array(width * height);
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
          sum += preciseFaceMask[ny * width + nx];
          count++;
        }
      }
      smoothFace[y * width + x] = sum / count;
    }
  }

  // Step 4: Render Composite
  const outputBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dstOffset = idx * 4;

      if (x < iconBoundaryX) {
        const faceA = smoothFace[idx];
        const strokeA = boldHairStrokes[idx];

        if (faceA > 0.1) {
          // GOLD FILL STRICTLY ON FACE
          const finalR = Math.round(255 - faceA * (255 - goldR));
          const finalG = Math.round(255 - faceA * (255 - goldG));
          const finalB = Math.round(255 - faceA * (255 - goldB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else if (strokeA > 0.05) {
          // Hair strands & F outline (clean line art, unfilled cavities)
          const finalR = Math.round(255 - strokeA * (255 - goldR));
          const finalG = Math.round(255 - strokeA * (255 - goldG));
          const finalB = Math.round(255 - strokeA * (255 - goldB));

          outputBuffer[dstOffset] = finalR;
          outputBuffer[dstOffset + 1] = finalG;
          outputBuffer[dstOffset + 2] = finalB;
          outputBuffer[dstOffset + 3] = 255;
        } else {
          // Open clean negative space (white background)
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

  console.log('Saved precise face-only logo to:', previewPath, 'and', liveLogoPath);
}

generatePreciseFaceOnly().catch(console.error);
