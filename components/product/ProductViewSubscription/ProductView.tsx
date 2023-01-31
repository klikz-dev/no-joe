import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { FC, useEffect, useState } from 'react'
import s from './ProductView.module.css'
import { Swatch, ProductSlider } from '@components/product'
import { Button, Container, Text, Input } from '@components/ui'
import type { Product } from '@commerce/types'
import { getVariant, SelectedOptions } from '../helpers'
import { useRouter } from 'next/router'

import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'

import Countdown from 'react-countdown'

interface Props {
  children?: any
  product: Product
  className?: string
}

const ProductView: FC<Props> = ({ product }) => {
  const [loading, setLoading] = useState(false)
  const [choices, setChoices] = useState<SelectedOptions>({})
  const [variant, setVariant] = useState(product.variants[0])
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [subscription, setSubscription] = useState(false)
  const [subscriptionPeriod, setSubscriptionPeriod] = useState(
    '2nd-amendment-flag-weekly'
  )

  const stripe = useStripe()

  const router = useRouter()
  const {
    pm,
    email,
    cus,
    name,
    address1,
    address2,
    phone,
    city,
    state,
    zip,
    product1,
    price1,
    product2,
    product3,
    product4,
    price4,
  } = router.query

  let nextLink = `/thank-you?product1=${product1}&price1=${price1}&product2=${product2}&product3=${product3}&product4=${product4}&price4=${price4}`
  let discount = 0
  let variantId = '39620071162026'

  if (
    product.slug === 'free-republican-decal' ||
    product.slug === 'bring-back-my-45-decal'
  ) {
    nextLink = `/product/hell-no-joe-upsell?pm=${pm}&cus=${cus}&name=${name}&email=${email}&address1=${address1}&address2=${address2}&phone=${phone}&city=${city}&state=${state}&zip=${zip}&product1=${product1}&price1=${price1}&product2=${product2}&product3=${product3}`
  }

  if (product.slug === 'hell-no-joe-upsell') {
    discount = 10
    variantId = '40276424097962'
  }

  useEffect(() => {
    // Selects the default option
    product.variants[0].options?.forEach((v) => {
      setChoices((choices) => ({
        ...choices,
        [v.displayName.toLowerCase()]: v.values[0].label.toLowerCase(),
      }))
    })
  }, [])

  useEffect(() => {
    setQuantity(
      parseInt(
        choices.quantity?.split(' ')[0] !== undefined
          ? choices.quantity?.split(' ')[0]
          : '1'
      )
    )
    const selectedVariant = getVariant(product, choices)
    if (selectedVariant !== undefined) {
      setVariant(selectedVariant)
      setError('')
    } else {
      setVariant(product.variants[0])
      setError('Selected option is not available.')
    }
  }, [choices])

  const addToCart = async () => {
    setLoading(true)

    const amount = variant ? variant.price : product.variants[0].price

    if (!stripe) {
      return
    }

    if (product.slug === 'free-republican-decal') {
      nextLink += `&product4=Raised Right - Decal x ${quantity}&price4=${amount}`
    }

    if (product.slug === 'bring-back-my-45-decal') {
      nextLink += `&product4=BRING BACK MY 45 - DECAL x ${quantity}&price4=${amount}`
    }

    if (product.slug === 'hell-no-joe-upsell') {
      nextLink += `&product5=Hell No Joe T-Shirt&price5=${amount}`
    }

    if (subscription) {
      axios
        .post('/api/stripe/create-subscription', {
          customerId: String(cus),
          paymentMethodId: String(pm),
          priceId: subscriptionPeriod,
        })
        .then(() => {
          window.location.replace(`${nextLink}`)
        })
        .catch((err) => {
          console.log(
            'Payment Error. Please Try again or Contact customer support.'
          )
          setLoading(false)
        })
    } else {
      const clientSecret = await axios.post(
        '/api/stripe/create-saved-payment-intent',
        {
          amount: ((amount - discount) * 100).toFixed(0),
          customer: String(cus),
          payment_method: String(pm),
        }
      )

      stripe
        .confirmCardPayment(clientSecret.data, {
          payment_method: String(pm),
        })
        .then(async function (result) {
          if (
            result.error &&
            result.error.code !== 'payment_intent_unexpected_state'
          ) {
            setError(String(result.error.message))
            setLoading(false)
          } else {
            axios
              .post('/api/shopify/order/upsell', {
                email: email,
                variant: variantId,
                quantity: quantity,
                name: name,
                address1: address1,
                address2: address2,
                phone: phone,
                city: city,
                state: state,
                zip: zip,
              })
              .then(() => {
                setError('')
                setLoading(false)
                window.location.replace(`${nextLink}`)
              })
              .catch((error) => {
                setError(error.message)
                setLoading(false)
              })
          }
        })
    }
  }

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    return (
      <div className="grid grid-cols-4 max-w-sm">
        <div>
          <p className="font-semibold text-2xl md:text-3xl text-center">
            {days}
          </p>
        </div>
        <div>
          <p className="font-semibold text-2xl md:text-3xl text-center">
            {hours}
          </p>
        </div>
        <div>
          <p className="font-semibold text-2xl md:text-3xl text-center">
            {minutes}
          </p>
        </div>
        <div>
          <p className="font-semibold text-2xl md:text-3xl text-center">
            {seconds}
          </p>
        </div>

        <div>
          <p className="font-semibold text-xl text-center text-gray-600">
            Days
          </p>
        </div>
        <div>
          <p className="font-semibold text-xl text-center text-gray-600">
            Hours
          </p>
        </div>
        <div>
          <p className="font-semibold text-xl text-center text-gray-600">
            Mins
          </p>
        </div>
        <div>
          <p className="font-semibold text-xl text-center text-gray-600">
            Secs
          </p>
        </div>
      </div>
    )
  }

  return (
    <Container className="max-w-none w-full" clean>
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images[0]?.url!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />

      <div className="p-3 bg-blue">
        <h1 className="text-white text-2xl md:text-4xl text-center font-bold">
          WAIT! YOUR ORDER IS NOT YET COMPLETE
        </h1>
      </div>

      <div className={cn(s.root, 'fit')}>
        <div className={cn(s.productDisplay, 'fit')}>
          <div className={s.sliderContainer}>
            <ProductSlider key={product.id}>
              {product.images.map((image, i) => (
                <div key={image.url} className={s.imageContainer}>
                  <Image
                    className={s.img}
                    src={image.url!}
                    alt={image.alt || 'Product Image'}
                    width={1050}
                    height={1050}
                    priority={i === 0}
                    quality="85"
                  />
                </div>
              ))}
            </ProductSlider>
          </div>
        </div>
        <div className={s.sidebar}>
          {product.slug === 'bring-back-my-45-decal' && (
            <>
              <div className="max-w-sm">
                <Image
                  className="w-full h-auto max-h-full object-contain"
                  src="/sale-banner.png"
                  alt="Sales Banner"
                  width={300}
                  height={100}
                  priority={true}
                  quality="85"
                />
              </div>

              <div className="mb-4">
                <Countdown date={new Date(2021, 5, 1)} renderer={renderer} />
              </div>
            </>
          )}

          <div className={s.nameBox}>
            <h1 className={s.name}>{product.name}</h1>
            <div className={s.price}>
              $
              {product.slug === 'hell-no-joe-upsell'
                ? (variant.price - 10).toFixed(2)
                : variant.price}
              {` `}
              {product.price?.currencyCode}
            </div>

            <div className="block line-through mb-4">
              {product.slug === 'hell-no-joe-upsell' ? (
                `${variant.price} ${product.price?.currencyCode}`
              ) : (product.slug === 'bring-back-my-45-decal' ||
                  product.slug === 'free-republican-decal') &&
                variant.listPrice ? (
                `${variant.listPrice} ${product.price?.currencyCode}`
              ) : (
                <p style={{ height: '24px' }}></p>
              )}
            </div>
          </div>

          <section>
            {product.options?.map((opt) => (
              <div className="pb-4" key={opt.displayName}>
                <h2 className="uppercase font-medium">
                  {opt.displayName !== 'Quantity' && opt.displayName}
                </h2>
                <div className="flex flex-row py-4">
                  {opt.values.map((v, i: number) => {
                    const active = (choices as any)[
                      opt.displayName.toLowerCase()
                    ]

                    return (
                      <Swatch
                        key={`${opt.id}-${i}`}
                        active={v.label.toLowerCase() === active}
                        variant={opt.displayName}
                        color={
                          v.hexColors
                            ? v.hexColors[0] === 'Sport Gray'
                              ? '#7D8081'
                              : v.hexColors[0] === 'Dark Heather'
                              ? '#373A39'
                              : v.hexColors[0]
                            : ''
                        }
                        label={v.label}
                        onClick={() => {
                          setChoices((choices) => {
                            return {
                              ...choices,
                              [opt.displayName.toLowerCase()]: v.label.toLowerCase(),
                            }
                          })
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="pb-14 break-words w-full max-w-xl">
              <Text html={product.descriptionHtml || product.description} />
            </div>
          </section>

          {product.slug !== 'free-republican-decal' && (
            <div className="w-36 flex flex-row mb-4">
              <span
                style={{ lineHeight: '42px' }}
                className="mr-2 font-semibold text-lg"
              >
                Quantity:{' '}
              </span>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e: any) => setQuantity(e)}
              />
            </div>
          )}

          <div className="mb-4">
            <div className="mb-2 text-lg">
              <label>
                <input
                  id="subscription"
                  type="checkbox"
                  name="subscription"
                  checked={subscription}
                  onChange={() => setSubscription(!subscription)}
                />
                <span className="text-red font-semibold">
                  {' '}
                  Subscribe and Save 10%
                </span>
              </label>
            </div>

            {subscription ? (
              <div>
                <Swatch
                  className="mb-2"
                  key="sub-opt-1"
                  active={subscriptionPeriod === '2nd-amendment-flag-weekly'}
                  variant="style"
                  label="Weekly"
                  onClick={() => {
                    setSubscriptionPeriod('2nd-amendment-flag-weekly')
                  }}
                />
                <Swatch
                  className="mb-2"
                  key="sub-opt-2"
                  active={subscriptionPeriod === '2nd-amendment-flag-biweekly'}
                  variant="style"
                  label="Bi-Weekly"
                  onClick={() => {
                    setSubscriptionPeriod('2nd-amendment-flag-biweekly')
                  }}
                />
                <Swatch
                  className="mb-2"
                  key="sub-opt-3"
                  active={subscriptionPeriod === '2nd-amendment-flag-monthly'}
                  variant="style"
                  label="Monthly"
                  onClick={() => {
                    setSubscriptionPeriod('2nd-amendment-flag-monthly')
                  }}
                />
                <Swatch
                  className="mb-2"
                  key="sub-opt-4"
                  active={subscriptionPeriod === '2nd-amendment-flag-bimonthly'}
                  variant="style"
                  label="Bi-Monthly"
                  onClick={() => {
                    setSubscriptionPeriod('2nd-amendment-flag-bimonthly')
                  }}
                />
              </div>
            ) : (
              <div style={{ height: '56px' }}></div>
            )}
          </div>

          <div>
            <div className="flex flex-col md:flex-row">
              <Button
                aria-label="Add to Cart"
                type="button"
                className={s.button}
                onClick={addToCart}
                loading={loading}
                disabled={error ? true : false}
              >
                Yes! Add This On!
              </Button>

              <div className="text-center" style={{ width: '300px' }}>
                <a
                  href={nextLink}
                  className="text-primary hover:text-accents-6 transition ease-in-out duration-150 text-xl"
                  style={{ lineHeight: '58px' }}
                >
                  No Thanks, I'll Pass
                </a>
              </div>
            </div>

            {error ? (
              <p className="text-red mt-2">{error}</p>
            ) : (
              <p className="mt-2" style={{ height: '24px' }}></p>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

// const stripePromise = loadStripe(
//   'pk_live_51Iam9HDWUatLAMhy0y4DfIkhAAtKbClHQj0OQQ42jl3hfPO5GuP3K2IY45E5S1M7pveqnJtRg2Q1nGH24rHvXWeZ00FjMBUYvK'
// )

const stripePromise = loadStripe(
  'pk_test_51Iam9HDWUatLAMhyMIlAr1UZ36ypGCrDRuWw3vg2p5a7Ks5xnIBtoq5WaSnLEdZXrNZ4NYGykboxiQfzKyfF4HY600hzp8lGpp'
)

const ProductViewCon: FC<Props> = ({ product }) => {
  return (
    <Elements stripe={stripePromise}>
      <ProductView product={product as any} />
    </Elements>
  )
}

export default ProductViewCon
