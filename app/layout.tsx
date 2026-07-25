import type {Metadata} from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Mapa do Degrade Sem Marca',
  applicationName: 'Mapa do Degrade Sem Marca',
  description: 'Guia visual para barbeiros entenderem pentes, alturas e transicoes no degrade.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="pt-BR">
      <head>
        <Script id="checkout-safety-net" strategy="beforeInteractive">
          {`
            (function () {
              document.addEventListener('click', function (event) {
                var el = event.target;
                while (el && el.tagName !== 'A') el = el.parentElement;
                if (!el) return;

                var href = el.getAttribute('href') || '';
                if (href.indexOf('pay.wiapy.com') === -1) return;

                var url = el.href;
                setTimeout(function () {
                  if (document.visibilityState === 'visible') {
                    window.location.href = url;
                  }
                }, 900);
              }, true);
            })();
          `}
        </Script>

        {/* Required by UTMify pixel.js. Keep before the pixel and do not async-load it separately. */}
        <Script
          id="utmify-sha256"
          src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.11.1/sha256.min.js"
          strategy="beforeInteractive"
        />

        {/* UTMify/Facebook pixel id. Must exist before pixel.js executes. */}
        <Script id="utmify-pixel-id" strategy="beforeInteractive">
          {`
            window.pixelId = "6a63d85a3d9edbac213bdd0e";
          `}
        </Script>

        {/* UTMify/Facebook pixel. Loaded once after sha256 and pixelId are available. */}
        <Script
          id="utmify-pixel"
          src="https://cdn.utmify.com.br/scripts/pixel/pixel.js"
          strategy="afterInteractive"
        />

        {/* UTMify UTMs. Loaded once and kept separate from checkout/navigation logic. */}
        <Script
          id="utmify-utms"
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        {children}

        {clarityId && (
          <Script id="clarity-init" strategy="lazyOnload">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}

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
