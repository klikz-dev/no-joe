import { Layout } from '@components/common'
import NextHead from 'next/head'
import Image from 'next/image'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

import { getConfig } from '@framework/api'
import getAllProducts from '@framework/product/get-all-products'
import getSiteInfo from '@framework/common/get-site-info'
import getAllPages from '@framework/common/get-all-pages'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })

  const { products } = await getAllProducts({
    variables: { first: 12 },
    config,
    preview,
  })

  const { categories, brands } = await getSiteInfo({ config, preview })
  const { pages } = await getAllPages({ config, preview })

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 14400,
  }
}

export default function Home({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const router = useRouter()
  const {
    product1,
    price1,
    product2,
    product3,
    product4,
    price4,
    product5,
    price5,
  } = router.query

  return (
    <>
      <NextHead>
        {/* Facebook Pixel Code  */}
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
            fbq('track', 'Purchase', {currency: "USD", value: 11.00});
          `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=488636955854599&ev=PageView&noscript=1"/>`,
          }}
        />
      </NextHead>

      <div className="p-3 bg-blue">
        <h1 className="text-white text-4xl text-center font-bold">
          Your Order Is Complete!
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:p-6">
          <div>
            <Image
              className="w-full h-auto max-h-full object-cover"
              src={'/thank-you.jpg'}
              alt={'Logo'}
              width={500}
              height={350}
              quality="100"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl text-red font-bold mb-8 italic">
              Congratulations!
            </h2>

            <p className="text-xl">
              Your order is complete and has now been placed with
              LibertyApparel.com Our team of American workers will process your
              American-made products as fast as they can! You'll be receiving an
              Order Confirmation in about one hour
            </p>
          </div>
        </div>

        <hr />

        <div className="px-6 py-12">
          <h3 className="text-xl text-black font-semibold mb-2 italic">
            How long does it take to receive your items?
          </h3>

          <p className="mb-8">
            We are a small, hard-working team and due to high demand we can
            sometimes get very busy, so please allow at least 1-2 weeks from
            today for your order to process, be shipped, and arrive! Though, the
            wait time could be longer depending on volume and time of year.
          </p>

          <h3 className="text-xl text-black font-semibold mb-2 italic">
            Where's my tracking information?
          </h3>

          <p className="mb-8">
            Once your item(s) have been custom-made and processed, we will send
            you an email and text notification with your order's tracking
            information once it has been shipped. Please allow up to 1 week for
            this to happen.
          </p>

          <h3 className="text-xl text-black font-semibold mb-2 italic">
            Need help?
          </h3>

          <p className="mb-0">
            If you have any questions about your order please send an email to
            our Support Specialists{' '}
            <a href="mailto:support@libertyapparel.com" className="text-blue">
              support@libertyapparel.com.
            </a>
          </p>
        </div>

        <hr />

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 pt-4 pb-1">
            <div className="col-span-2">
              <p className="font-bold">Product</p>
            </div>
            <div className="col-span-1">
              <p className="font-bold text-right">Price</p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-3 py-4">
            {product1 && product1 !== undefined && (
              <>
                <div className="font-semibold mb-1 col-span-2">{product1}</div>
                <div className="text-right">${price1}</div>
              </>
            )}
            {product2 && product2 !== undefined && (
              <>
                <div className="pl-4 text-sm col-span-2">
                  2nd Amendment Decal
                </div>
                <div className="text-right">$3.99</div>
              </>
            )}
            {product3 && product3 !== undefined && (
              <>
                <div className="pl-4 text-sm mb-3 col-span-2">
                  Priority Shipping
                </div>
                <div className="text-right">$1.99</div>
              </>
            )}
            {product4 && product4 !== undefined && (
              <>
                <div className="font-semibold mb-1 col-span-2">{product4}</div>
                <div className="text-right">${price4}</div>
              </>
            )}
            {product5 && product5 !== undefined && (
              <>
                <div className="font-semibold mb-1 col-span-2">{product5}</div>
                <div className="text-right">${price4}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

Home.Layout = Layout
