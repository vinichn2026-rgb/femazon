const sharp = require('sharp');
const path = require('path');

async function generateFullSolidFAndFace() {
  const userIconPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\.user_uploaded\\media_1788344235625.png';
  const originalLogoPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\8b795d2d-d990-43d1-848d-1c3777ddae67\\femazon_minimalist_geometric_logo_1788337817954.jpg';
  const previewPath = path.join(__dirname, '..', 'public', 'femazon-full-f-gold-preview.png');
  const liveLogoPath = path.join(__dirname, '..', 'public', 'femazon-logo.png');

  console.log('Generating 100% full solid gold icon with filled F shape...');

  // 1. Load original logo for canvas dimensions and maroon wordmark
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

  // 2. Load user icon
  const userIcon = sharp(userIconPath);
  const targetIconW = 330;
  const targetIconH = 412;
  const targetIconX = 135;
  const targetIconY = Math.round((height - targetIconH) / 2);

  const resizedUserIcon = await userIcon.resize(targetIconW, targetIconH, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const userIconData = resizedUserIcon.data;
  const userChannels = resizedUserIcon.info.channels;

  // 3. Create a 2D mask of the user icon
  const iconMask = new Float32Array(targetIconW * targetIconH);

  for (let iy = 0; iy < targetIconH; iy++) {
    for (let ix = 0; ix < targetIconW; ix++) {
      const uidx = (iy * targetIconW + ix) * userChannels;
      const uR = userIconData[uidx];
      const uG = userIconData[uidx + 1];
      const uB = userIconData[uidx + 2];
      const uA = userChannels === 4 ? userIconData[uidx + 3] : 255;

      const lum = 0.299 * uR + 0.587 * uG + 0.114 * uB;
      if (uA > 30 && lum < 248) {
        iconMask[iy * targetIconW + ix] = 1.0;
      }
    }
  }

  // 4. Flood fill exterior of icon bounding box to find the true outer boundary
  // Any internal enclosed cavities (like inside the F loop and ribbon loops) will be filled completely!
  const isOuter = new Uint8Array(targetIconW * targetIconH);
  const queue = [];

  // Seed boundary edges
  for (let x = 0; x < targetIconW; x++) {
    if (iconMask[x] === 0) { isOuter[x] = 1; queue.push(x); }
    const btmIdx = (targetIconH - 1) * targetIconW + x;
    if (iconMask[btmIdx] === 0) { isOuter[btmIdx] = 1; queue.push(btmIdx); }
  }
  for (let y = 0; y < targetIconH; y++) {
    const leftIdx = y * targetIconW;
    if (iconMask[leftIdx] === 0) { isOuter[leftIdx] = 1; queue.push(leftIdx); }
    const rightIdx = y * targetIconW + (targetIconW - 1);
    if (iconMask[rightIdx] === 0) { isOuter[rightIdx] = 1; queue.push(rightIdx); }
  }

  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    const cx = cur % targetIconW;
    const cy = Math.floor(cur / targetIconW);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < targetIconW && ny >= 0 && ny < targetIconH) {
        const nidx = ny * targetIconW + nx;
        if (!isOuter[nidx] && iconMask[nidx] === 0) {
          isOuter[nidx] = 1;
          queue.push(nidx);
        }
      }
    }
  }

  // Fully solid filled icon mask (everything that is not outer background)
  const fullSolidIcon = new Float32Array(targetIconW * targetIconH);
  for (let i = 0; i < targetIconW * targetIconH; i++) {
    if (!isOuter[i]) {
      fullSolidIcon[i] = 1.0;
    }
  }

  // Anti-aliased edge smoothing for solid gold icon
  const smoothFullGold = new Float32Array(targetIconW * targetIconH);
  for (let y = 0; y < targetIconH; y++) {
    for (let x = 0; x < targetIconW; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= targetIconH) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= targetIconW) continue;
          sum += fullSolidIcon[ny * targetIconW + nx];
          count++;
        }
      }
      smoothFullGold[y * targetIconW + x] = sum / count;
    }
  }

  // 5. Composite image
  const outputBuffer = Buffer.alloc(width * height * 4);

  // Fill canvas with white initially
  for (let i = 0; i < width * height; i++) {
    outputBuffer[i * 4] = 255;
    outputBuffer[i * 4 + 1] = 255;
    outputBuffer[i * 4 + 2] = 255;
    outputBuffer[i * 4 + 3] = 255;
  }

  // Draw Wordmark FEMAZON (x >= 478) in solid royal maroon
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

  // Draw the 100% Solid Golden Icon (with F shape fully filled)
  for (let iy = 0; iy < targetIconH; iy++) {
    for (let ix = 0; ix < targetIconW; ix++) {
      const canvasX = targetIconX + ix;
      const canvasY = targetIconY + iy;

      if (canvasX >= width || canvasY >= height) continue;

      const alpha = smoothFullGold[iy * targetIconW + ix];
      if (alpha > 0.05) {
        const dstOffset = (canvasY * width + canvasX) * 4;

        const finalR = Math.round(255 - alpha * (255 - goldR));
        const finalG = Math.round(255 - alpha * (255 - goldG));
        const finalB = Math.round(255 - alpha * (255 - goldB));

        outputBuffer[dstOffset] = finalR;
        outputBuffer[dstOffset + 1] = finalG;
        outputBuffer[dstOffset + 2] = finalB;
        outputBuffer[dstOffset + 3] = 255;
      }
    }
  }

  // Save to preview and live logo
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

  console.log('Saved full solid F & gold icon to:', previewPath, 'and', liveLogoPath);
}

generateFullSolidFAndFace().catch(console.error);
