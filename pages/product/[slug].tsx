import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView, ProductViewSubscription } from '@components/product'

import { getConfig } from '@framework/api'
import getProduct from '@framework/product/get-product'
import getAllPages from '@framework/common/get-all-pages'
import getAllProductPaths from '@framework/product/get-all-product-paths'

export async function getStaticProps({
  params,
  locale,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  const { product } = await getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: {
      pages,
      product,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await getAllProductPaths()

  return {
    paths: locales
      ? locales.reduce<string[]>((arr, locale) => {
          // Add a product path for every locale
          products.forEach((product) => {
            arr.push(`/${locale}/product${product.node.path}`)
          })
          return arr
        }, [])
      : products.map((product) => `/product${product.node.path}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <>
      {(product.slug === 'free-republican-decal' ||
        product.slug === 'bring-back-my-45-decal') && (
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
      )}

      {product.slug === '2nd-amendment-flag' ? (
        <ProductViewSubscription product={product as any} />
      ) : (
        <ProductView product={product as any} />
      )}
    </>
  )
}

Slug.Layout = Layout
