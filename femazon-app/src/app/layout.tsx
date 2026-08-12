import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { getSessionFromCookie } from '@/lib/auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Femazon',
  description: 'A modern marketplace experience built with Next.js and Prisma',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('femazon_session')?.value;
  const authSession = getSessionFromCookie(
    sessionCookie ? `femazon_session=${sessionCookie}` : undefined
  );

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteLayout authSession={authSession}>{children}</SiteLayout>
      </body>
    </html>
  );
}
