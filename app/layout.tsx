import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mapa do Degradê Sem Marca',
  description: 'Entenda a lógica dos pentes, alturas e transições com um mapa visual prático.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link
          rel="preload"
          href="/images/hero/mockup-hero-guia-principal.webp"
          as="image"
          type="image/webp"
          fetchpriority="high"
        />
      </head>
      <body className="font-sans antialiased bg-[#0B0704] text-[#FFF4E6]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
