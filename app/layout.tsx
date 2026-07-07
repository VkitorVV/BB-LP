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
          as="image"
          href="/images/hero/mockup-hero-guia-principal.webp"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/_next/image?url=%2Fimages%2Fhero%2Fmockup-hero-guia-principal.webp&w=640&q=75 640w, /_next/image?url=%2Fimages%2Fhero%2Fmockup-hero-guia-principal.webp&w=828&q=75 828w"
          imageSizes="(max-width: 500px) calc(100vw - 40px), 648px"
        />
        {/* CSS crítico inline — elimina render-blocking para a primeira dobra */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,::after,::before{box-sizing:border-box}
          html{-webkit-font-smoothing:antialiased}
          body{margin:0;background:#0B0704;color:#FFF4E6;overflow-x:hidden}
          img{display:block;max-width:100%}
          .texture-brick{background-color:#160D08;position:relative}
          .font-display{font-family:var(--font-display),'Bebas Neue',system-ui,sans-serif}
          .badge-gold{display:inline-block;padding:4px 12px;border-radius:9999px;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(216,166,74,.15);border:1px solid rgba(216,166,74,.4);color:#D8A64A}
        ` }} />
      </head>
      <body className="font-sans antialiased bg-[#0B0704] text-[#FFF4E6]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />

        {/* ── UTMify — afterInteractive: captura UTMs antes dos eventos de checkout ── */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
          strategy="afterInteractive"
        />

        {/* ── Pixel Facebook via UTMify — afterInteractive ── */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`window.pixelId="6a4b090cd0b0714e73bcc2f6";var a=document.createElement("script");a.setAttribute("async","");a.setAttribute("defer","");a.setAttribute("src","https://cdn.utmify.com.br/scripts/pixel/pixel.js");document.head.appendChild(a);`}
        </Script>

        {/* Microsoft Clarity — lazyOnload, carrega apenas após idle */}
        {clarityId && (
          <Script id="clarity-init" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}

        {/* Google Analytics GA4 — lazyOnload, não bloqueia LCP */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
