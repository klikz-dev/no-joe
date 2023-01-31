import { FC } from 'react'
import NextHead from 'next/head'
import { DefaultSeo } from 'next-seo'
import config from '@config/seo.json'

const Head: FC = () => {
  return (
    <>
      <DefaultSeo {...config} />
      <NextHead>
        <script src="https://dev.visualwebsiteoptimizer.com/lib/564341.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDkf9o9lnk5DM3IyLbC4kr7tEqzHsw6VU4&libraries=places"></script>

        {/* Facebook Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '488636955854599');
          fbq('track', 'PageView');`,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=488636955854599&ev=PageView&noscript=1"/>`,
          }}
        />

        {/* Hyros Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = "https://178868.tracking.hyros.com/v1/lst/universal-script?ph=55be8ffac0f0160391722ff830701cdc0f92acab5740645218c83bb7973bcb12&tag=!tracking";
            head.appendChild(script);`,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N7TMGPG');`,
          }}
        />

        {/* Global site tag (gtag.js) - Google Ads: 388763372 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-388763372"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-388763372');`,
          }}
        />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-193044985-1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-193044985-1');`,
          }}
        />

        {/* Revcontent */}
        <script src="https://assets.revcontent.com/master/rev.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `rev('event', 'page_view');`,
          }}
        />
      </NextHead>
    </>
  )
}

export default Head
