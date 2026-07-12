import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';

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
        <script
          dangerouslySetInnerHTML={{ __html: `
            (function(){
              var ATTR = 'bis_skin_checked';
              function clean(root){
                try {
                  if (!root || !root.querySelectorAll) return;
                  if (root.hasAttribute && root.hasAttribute(ATTR)) root.removeAttribute(ATTR);
                  root.querySelectorAll('[' + ATTR + ']').forEach(function(el){
                    el.removeAttribute(ATTR);
                  });
                } catch (_) {}
              }
              clean(document.documentElement);
              if (typeof MutationObserver === 'undefined') return;
              var observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation){
                  if (mutation.type === 'attributes' && mutation.attributeName === ATTR) {
                    mutation.target.removeAttribute(ATTR);
                  }
                  mutation.addedNodes && mutation.addedNodes.forEach(function(node){
                    if (node && node.nodeType === 1) clean(node);
                  });
                });
              });
              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: [ATTR]
              });
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function(){ clean(document.documentElement); }, { once: true });
              } else {
                clean(document.documentElement);
              }
              window.addEventListener('load', function(){
                clean(document.documentElement);
                setTimeout(function(){ observer.disconnect(); }, 3000);
              }, { once: true });
            })();
          ` }}
        />
        {/* ── Preconnect para origens críticas de terceiros ──────────────────
            Antecipa a conexão TCP+TLS antes dos scripts carregarem.
            Economiza ~320–410ms de latência (api6.ipify, cdn.utmify, tracking.utmify).
            NÃO altera ordem ou timing de execução dos scripts. ── */}
        <link rel="preconnect" href="https://cdn.utmify.com.br" />
        <link rel="preconnect" href="https://tracking.utmify.com.br" />
        <link rel="preconnect" href="https://api6.ipify.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* ── Preload da imagem LCP — tamanho real de exibição 648px ────── */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fimages%2Fhero%2Fmockup-hero-guia-principal.webp&w=828&q=75"
          type="image/webp"
          fetchPriority="high"
        />

        {/* ── CSS crítico inline — elimina os ~170ms de render-blocking ───
            Contém apenas o necessário para pintar a primeira dobra
            (body bg, texto, badge, font-display) sem layout shift. ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,::after,::before{box-sizing:border-box}
          html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
          body{margin:0;background:#0B0704;color:#FFF4E6;overflow-x:hidden;font-family:system-ui,sans-serif}
          img{display:block;max-width:100%;height:auto}
          .texture-brick{background-color:#160D08;position:relative}
          .font-display{font-family:var(--font-display),'Bebas Neue',system-ui,sans-serif}
          .badge-gold{display:inline-block;padding:4px 12px;border-radius:9999px;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(216,166,74,.15);border:1px solid rgba(216,166,74,.4);color:#D8A64A}
          .font-sans{font-family:var(--font-sans),system-ui,sans-serif}
          .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        ` }} />
      </head>

      <body className="font-sans antialiased bg-[#0B0704] text-[#FFF4E6]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />

        {/* ── UTMify latest.js — afterInteractive ────────────────────────
            Captura UTMs da URL assim que a página interagir.
            Deve carregar ANTES do pixel.js para herança de atribuição.
            NÃO alterar para lazyOnload — pode perder UTM em clique rápido. ── */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
          strategy="afterInteractive"
        />

        {/* ── Pixel Facebook via UTMify — afterInteractive ────────────────
            Carrega pixel.js APÓS latest.js para herdar dados de UTM.
            window.pixelId deve estar definido antes do script carregar.
            NÃO alterar para lazyOnload — pode perder PageView de atribuição. ── */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`window.pixelId="6a4b090cd0b0714e73bcc2f6";var a=document.createElement("script");a.setAttribute("async","");a.setAttribute("defer","");a.setAttribute("src","https://cdn.utmify.com.br/scripts/pixel/pixel.js");document.head.appendChild(a);`}
        </Script>

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
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
