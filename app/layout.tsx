import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'block',
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'block',
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
        <link rel="preconnect" href="https://cdn.utmify.com.br" />
        <link rel="preconnect" href="https://tracking.utmify.com.br" />
        <link rel="preconnect" href="https://api6.ipify.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              src="https://cdn.utmify.com.br/scripts/utms/latest.js"
              data-utmify-prevent-xcod-sck
              data-utmify-prevent-subids
              async
              defer
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.pixelId = "6a4b090cd0b0714e73bcc2f6";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);
            `,
              }}
            />
          </>
        )}

        {/* ── Preload da imagem LCP — tamanho real de exibição 648px ────── */}
        {/* ── CSS crítico inline — elimina os ~170ms de render-blocking ───
            Contém apenas o necessário para pintar a primeira dobra
            (body bg, texto, badge, font-display) sem layout shift. ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,::after,::before{box-sizing:border-box}
          html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
          html,body{background:#0B0704}
          body{margin:0;background:#0B0704;color:#F7F1E8;overflow-x:hidden;font-family:var(--font-sans),system-ui,sans-serif}
          img{display:block;max-width:100%;height:auto}
          main{background:#0B0704;color:#F7F1E8}
          #hero{background:#0B0704!important;color:#F7F1E8!important}
          #hero .hero-bg{background:#0B0704!important}
          #hero .hero-title,#hero .hero-title-line,#hero .hero-underline-text{color:#F7F1E8!important}
          #hero .hero-tension,#hero .hero-product-copy{color:rgba(247,241,232,.78)!important}
          .texture-brick{background-color:#140D08;position:relative}
          .font-display{font-family:var(--font-display),'Bebas Neue',system-ui,sans-serif}
          .badge-gold{display:inline-block;padding:4px 12px;border-radius:8px;font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:#EFE6D8;border:1px solid #D8C9B6;color:#6E4A11}
          .font-sans{font-family:var(--font-sans),system-ui,sans-serif}
          .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        ` }} />
      </head>

      <body className="font-sans antialiased bg-[#0B0704] text-[#F7F1E8]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />

        {/* ── Microsoft Clarity — lazyOnload (após idle) ───────────────── */}
        {clarityId && (
          <Script id="clarity-init" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}

        {/* ── Google Analytics GA4 — afterInteractive ───────────────────── */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
