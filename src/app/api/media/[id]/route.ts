import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return new NextResponse('Media ID required', { status: 400 });
    }

    const media = await (prisma as any).productMedia.findUnique({
      where: { id },
    });

    if (!media || !media.data) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const buffer = Buffer.from(media.data);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': media.mimeType || 'image/jpeg',
        'Content-Length': String(media.size || buffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[MediaRoute] Error serving media:', error);
    return new NextResponse('Failed to load media', { status: 500 });
  }
}
