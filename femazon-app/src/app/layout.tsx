import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { getSessionFromCookie } from '@/lib/auth';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Femazon',
  description: 'A modern luxury marketplace experience built with Next.js and Prisma',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('femazon_session')?.value;
  const authSession = getSessionFromCookie(
    sessionCookie ? `femazon_session=${sessionCookie}` : undefined
  );

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteLayout authSession={authSession}>{children}</SiteLayout>
      </body>
    </html>
  );
}
