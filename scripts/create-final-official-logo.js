const sharp = require('sharp');
const path = require('path');

async function createOfficialLogo() {
  const userIconPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\.user_uploaded\\media_1788344235625.png';
  const originalLogoPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const outputPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Building official logo from user uploaded gold icon...');

  // 1. Load original logo to get the wordmark "FEMAZON" and canvas sizing
  const origImg = sharp(originalLogoPath);
  const { data: origData, info: origInfo } = await origImg.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = origInfo;

  // Solid Radiant 24K Warm Gold: RGB(208, 158, 52)
  const goldR = 208;
  const goldG = 158;
  const goldB = 52;

  // Solid Deep Royal Maroon for FEMAZON: RGB(74, 21, 19) -> #4A1513
  const maroonR = 74;
  const maroonG = 21;
  const maroonB = 19;

  // 2. Load user's uploaded icon
  const userIcon = sharp(userIconPath);
  // Resize user icon to match the left icon bounding area in original image
  // In original image, icon was roughly width 330, height 400 centered vertically
  const targetIconW = 330;
  const targetIconH = 412;
  const targetIconX = 135;
  const targetIconY = Math.round((height - targetIconH) / 2);

  const resizedUserIcon = await userIcon.resize(targetIconW, targetIconH, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const userIconData = resizedUserIcon.data;
  const userChannels = resizedUserIcon.info.channels;

  // 3. Composite everything cleanly onto a white 1376x768 canvas
  const outputBuffer = Buffer.alloc(width * height * 4);

  // Fill canvas with white initially
  for (let i = 0; i < width * height; i++) {
    outputBuffer[i * 4] = 255;
    outputBuffer[i * 4 + 1] = 255;
    outputBuffer[i * 4 + 2] = 255;
    outputBuffer[i * 4 + 3] = 255;
  }

  // Draw the wordmark "FEMAZON" from original logo (x >= 478)
  for (let y = 0; y < height; y++) {
    for (let x = 478; x < width; x++) {
      const idx = y * width + x;
      const srcOffset = idx * channels;
      const dstOffset = idx * 4;

      const r = origData[srcOffset];
      const g = origData[srcOffset + 1];
      const b = origData[srcOffset + 2];

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < 248) {
        const darkness = Math.min(1, Math.max(0, (248 - lum) / 248));
        const boost = Math.pow(darkness, 0.8);

        const finalR = Math.round(255 - boost * (255 - maroonR));
        const finalG = Math.round(255 - boost * (255 - maroonG));
        const finalB = Math.round(255 - boost * (255 - maroonB));

        outputBuffer[dstOffset] = finalR;
        outputBuffer[dstOffset + 1] = finalG;
        outputBuffer[dstOffset + 2] = finalB;
        outputBuffer[dstOffset + 3] = 255;
      }
    }
  }

  // Draw the full solid golden icon from user's uploaded art (x from targetIconX to targetIconX + targetIconW)
  for (let iy = 0; iy < targetIconH; iy++) {
    for (let ix = 0; ix < targetIconW; ix++) {
      const canvasX = targetIconX + ix;
      const canvasY = targetIconY + iy;

      if (canvasX >= width || canvasY >= height) continue;

      const userIdx = (iy * targetIconW + ix) * userChannels;
      const uR = userIconData[userIdx];
      const uG = userIconData[userIdx + 1];
      const uB = userIconData[userIdx + 2];
      const uA = userChannels === 4 ? userIconData[userIdx + 3] : 255;

      const dstOffset = (canvasY * width + canvasX) * 4;

      // Check if this pixel is part of the icon (non-white and has opacity)
      const uLum = 0.299 * uR + 0.587 * uG + 0.114 * uB;
      const alphaFactor = (uA / 255) * (uLum < 248 ? (248 - uLum) / 248 : 0);

      if (alphaFactor > 0.05) {
        // Boost solid gold intensity across all painted regions
        const boostAlpha = Math.min(1, alphaFactor * 1.8);

        const finalR = Math.round(255 - boostAlpha * (255 - goldR));
        const finalG = Math.round(255 - boostAlpha * (255 - goldG));
        const finalB = Math.round(255 - boostAlpha * (255 - goldB));

        outputBuffer[dstOffset] = finalR;
        outputBuffer[dstOffset + 1] = finalG;
        outputBuffer[dstOffset + 2] = finalB;
        outputBuffer[dstOffset + 3] = 255;
      }
    }
  }

  // Save to public/femazon-logo.png
  await sharp(outputBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Successfully saved official gold-filled logo to:', outputPath);
}

createOfficialLogo().catch(console.error);
