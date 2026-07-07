import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';

// next/font/google automaticamente baixa e serve as fontes do próprio domínio
// na Vercel — não gera request para fonts.googleapis.com nem fonts.gstatic.com
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Mapa do Degradê Sem Marca',
  description: 'Entenda a lógica dos pentes, alturas e transições com um mapa visual prático.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId      = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link
          rel="preload"
          href="/images/hero/mockup-hero-guia-principal.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="font-sans antialiased bg-[#0B0704] text-[#FFF4E6]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>

      {/* Microsoft Clarity — lazyOnload para não bloquear LCP */}
      {clarityId && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* Google Analytics GA4 — lazyOnload para não bloquear LCP */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
