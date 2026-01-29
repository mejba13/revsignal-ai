import type { Metadata } from 'next';
import { Red_Hat_Display, Outfit } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import './globals.css';

const redHatDisplay = Red_Hat_Display({
  variable: '--font-red-hat-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'RevSignal AI - Predictive Revenue Intelligence',
    template: '%s | RevSignal AI',
  },
  description:
    'Transform your CRM into a predictive revenue command center. AI-powered deal scoring, risk detection, and revenue forecasting.',
  keywords: [
    'revenue intelligence',
    'deal scoring',
    'sales AI',
    'CRM analytics',
    'pipeline management',
    'revenue forecasting',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${redHatDisplay.variable} ${outfit.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
