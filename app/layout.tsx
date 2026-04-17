import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

import { WalletProvider } from '@/components/wallet/WalletProvider';
import { BackgroundFX } from '@/components/layout/BackgroundFX';
import { Preloader } from '@/components/layout/Preloader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#05070d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://flip402.com'),
  title: 'FLIP402 — HTTP 402, Payment Required',
  description:
    'HTTP 402 was unused for 26 years. Coinbase and Solana brought it back. FLIP402 is the human-facing demo: pay 0.005 SOL, pick a number from 1 to 402, beat the odds for ×380.',
  keywords: [
    'x402',
    'HTTP 402',
    'Solana',
    'coin flip',
    'onchain',
    'Coinbase',
    'payment protocol',
    'agent payments',
  ],
  openGraph: {
    title: 'FLIP402 — HTTP 402, Payment Required',
    description: 'Flip the 402. Get paid or get rekt. Built on Solana · x402 Protocol.',
    type: 'website',
    url: 'https://flip402.com',
    siteName: 'FLIP402',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLIP402',
    description: 'Flip the 402. Get paid or get rekt.',
    creator: '@flip402',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-void text-text antialiased">
        <WalletProvider>
          <Preloader />
          <BackgroundFX />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(8, 15, 35, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                backdropFilter: 'blur(16px)',
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
