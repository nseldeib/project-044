import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/app/components/Navbar';
import OnboardingModal from '@/app/components/OnboardingModal';

export const metadata: Metadata = {
  title: 'VECTOR — Movement Intelligence',
  description: 'Real-time movement intelligence platform for air traffic, city bikes, and subway systems.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          margin: 0,
          padding: 0,
        }}
      >
        <OnboardingModal />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
