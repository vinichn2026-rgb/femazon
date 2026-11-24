import { NextResponse } from 'next/server';
import { getApiAuthEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mkdir, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { join } from 'path';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function hasValidImageSignature(type: string, buffer: Buffer) {
  if (type === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (type === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (type === 'image/webp') {
    return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const email = await getApiAuthEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });
    if (!user || !['CUSTOMER', 'VENDOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Only approved vendors and administrators can upload images.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const originalFilename = typeof (file as any).name === 'string' ? (file as any).name : 'upload';
    const extension = IMAGE_TYPES.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: 'Upload a JPEG, PNG, or WebP image.' }, { status: 415 });
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image size must be between 1 byte and 5 MB.' }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!hasValidImageSignature(file.type, buffer)) {
      return NextResponse.json({ error: 'The uploaded file content does not match an allowed image type.' }, { status: 415 });
    }

    // 1. Store permanently in PostgreSQL database
    const media = await (prisma as any).productMedia.create({
      data: {
        filename: originalFilename,
        mimeType: file.type,
        size: buffer.length,
        data: buffer,
      },
    });

    const fileUrl = `/api/media/${media.id}`;

    // 2. Best-effort local file write for local development caching (optional, ignores read-only failures)
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const localFilename = `${media.id}.${extension}`;
      const localPath = join(uploadDir, localFilename);
      await mkdir(uploadDir, { recursive: true });
      await writeFile(localPath, buffer);
    } catch {
      // Ignore filesystem errors in serverless/read-only environments
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      mediaId: media.id,
      filename: originalFilename,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file to database storage.' }, { status: 500 });
  }
}
