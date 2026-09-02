import type { Metadata } from 'next';
import { Montserrat, Playfair_Display, Jost } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { getSessionFromCookie } from '@/lib/auth';
import { FemazonStoreProvider } from '@/context/FemazonStoreContext';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Femazon | Luxury Indian Couture & Designer Wear',
  description: 'Shop luxury Indian designer couture, bridal lehengas, silk sarees, and contemporary anarkali sets.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('femazon_session')?.value;
  const authSession = getSessionFromCookie(
    sessionCookie ? `femazon_session=${sessionCookie}` : undefined
  );

  return (
    <html lang="en" className={`${montserrat.variable} ${jost.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <FemazonStoreProvider>
          <SiteLayout authSession={authSession}>{children}</SiteLayout>
        </FemazonStoreProvider>
      </body>
    </html>
  );
}
