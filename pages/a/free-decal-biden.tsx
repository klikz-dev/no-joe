import { useRef } from 'react'
import { Layout } from '@components/common'

import Image from 'next/image'
import { HeroA, Button } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

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
  const scrollToRefObject = (ref: any) =>
    window.scrollTo(100, ref.current?.offsetTop)

  const pricingForm = useRef(null)
  const goPricing = () => {
    scrollToRefObject(pricingForm)
  }

  return (
    <>
      <HeroA
        headline="CALLING ALL GUN OWNERS..."
        description="Claim Your FREE “Hell No Joe“ Decal!"
        cRef={pricingForm}
      />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-solid border-4 border-gray-600 p-3 md:p-6">
          <div>
            <Image
              className="w-full h-auto max-h-full object-cover"
              src={'/indoorvsoutdoor.png'}
              alt={'Logo'}
              width={1080}
              height={1080}
              quality="85"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl text-red font-bold mb-8 italic">
              Biden Represents Leadership That America Doesn't Want!{' '}
            </h2>

            <p className="text-xl mb-12">
              Our president did everything he can to make America great. With
              Joe Biden in office, he's tearing down all of Trump's hard work
              and ruining the country. He's now trying to pass his gun control
              policies through an excutive order. Show your disapproval of
              Biden's gun control with this high-quality Decal.
            </p>

            <ul className="list-disc list-inside mb-12">
              <li className="text-semibold text-xl">
                Can Be Used Indoors AND Outdoors
              </li>
              <li className="text-semibold text-xl">Size - 3x4 inches</li>
              <li className="text-semibold text-xl">Made In The USA</li>
            </ul>

            <Button className="text-2xl" onClick={goPricing}>
              GET YOURS FREE NOW
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

Home.Layout = Layout
