import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from '../Button'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'

import axios from 'axios'

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#33b5e5',
      color: '#000000',
      fontWeight: 400,
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#263238',
      },
      '::placeholder': {
        color: '#212529',
      },
    },
    invalid: {
      iconColor: '#CC0000',
      color: '#ff4444',
    },
  },
}

const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
)

const ErrorMessage = ({ children }) => (
  <div className="block mb-2" role="alert">
    <p className="m-0 text-red">
      <small>{children}</small>
    </p>
  </div>
)

const CheckoutForm = (props) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [decal, setDecal] = useState(5)
  const [flag, setFlag] = useState(1)
  const [fast, setFast] = useState(1)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    setAmount(decal * 2.99 + flag * 3.99 + fast * 1.99)
  }, [flag, decal, fast])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (error) {
      elements.getElement('card').focus()
      return
    }

    if (cardComplete) {
      setProcessing(true)
    }

    const clientSecret = await axios.post('/api/stripe/create-payment-intent', {
      amount: parseInt(amount * 100),
    })

    if (clientSecret.error) {
      setError(clientSecret.error)
    } else {
      stripe
        .confirmCardPayment(clientSecret.data, {
          receipt_email: props.email,
          setup_future_usage: 'off_session',
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: props.email,
              name: props.name,
              phone: props.phone,
            },
          },
        })
        .then(async function (result) {
          if (result.error) {
            setError(result.error)
            setProcessing(false)
          } else {
            try {
              await axios.post('/api/shopify/order/decal', {
                email: props.email,
                flag: flag,
                fast: fast,
                decal: decal,
                name: props.name,
                address1: props.address1,
                address2: props.address2,
                phone: props.phone,
                city: props.city,
                state: props.state,
                zip: props.zip,
              })

              const customer = await axios.post('/api/stripe/create-customer', {
                email: props.email,
                payment_method: result.paymentIntent.payment_method,
              })

              const flow = Math.floor(Math.random() * 2)

              window.location.replace(
                `/product/${
                  flow ? 'free-republican-decal' : 'bring-back-my-45-decal'
                }?pm=${result.paymentIntent.payment_method}&cus=${
                  customer.data.id
                }&name=${props.name}&email=${props.email}&address1=${
                  props.address1
                }&address2=${props.address2}&phone=${props.phone}&city=${
                  props.city
                }&state=${props.state}&zip=${
                  props.zip
                }&product1=Hell No Joe Decal x ${decal}&price1=${amount}&product2=${flag}&product3=${fast}`
              )
            } catch (error) {
              setError(error)
              setProcessing(false)
            }
          }
        })
    }
  }

  const handlePrev = (e) => {
    e.preventDefault()

    props.onClickPrev()
  }

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between mb-2">
        <label>
          <input
            id="quantity-1"
            value="1"
            type="radio"
            name="quantity"
            checked={decal === 1}
            onChange={() => setDecal(1)}
          />
          <span> 1 Hell No Joe Decal</span>
        </label>
        <span>$2.99 S+H</span>
      </div>

      <div className="flex flex-row justify-between mb-2">
        <label>
          <input
            id="quantity-2"
            value="2"
            type="radio"
            name="quantity"
            checked={decal === 2}
            onChange={() => setDecal(2)}
          />
          <span> 2 Hell No Joe Decal</span>
        </label>
        <span>$2.99 S+H</span>
      </div>

      <div className="flex flex-row justify-between mb-2">
        <label>
          <input
            id="quantity-5"
            value="5"
            type="radio"
            name="quantity"
            checked={decal === 5}
            onChange={() => setDecal(5)}
          />
          <span>
            {' '}
            5 Hell No Joe Decal (
            <span className="text-yellow-600">MOST POPULAR!</span>)
          </span>
        </label>
        <span>$2.99 S+H</span>
      </div>

      <div className="flex flex-row justify-between mb-2">
        <label>
          <input
            id="quantity-10"
            value="10"
            type="radio"
            name="quantity"
            checked={decal === 10}
            onChange={() => setDecal(10)}
          />
          <span> 10 Hell No Joe Decal</span>
        </label>
        <span>$2.99 S+H</span>
      </div>

      <hr />

      <div className="border-gray-400 border-solid border-2 p-3 my-2">
        <div className="">
          <fieldset className="FormGroup">
            <CardField
              onChange={(e) => {
                setError(e.error)
                setCardComplete(e.complete)
              }}
            />
          </fieldset>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2 p-2 bg-yellow-50 border-2 border-black border-dashed">
        <div>
          <label className="mb-1 bg-yellow-200 px-2">
            <input
              id="flag"
              type="checkbox"
              name="flag"
              checked={flag}
              onChange={() => setFlag(Math.abs(flag - 1))}
            />
            <span className="ml-2 text-green font-bold">
              Yes, I will Take It!
            </span>
          </label>
          <p className="text-sm pt-2">
            <span className="text-red underline font-bold">
              ONE TIME OFFER:{' '}
            </span>
            <br />
            Exclusively with this order, we'll give you our 2nd Amendment Decal
            for FREE! All you have to do is pay S&H of $3.99 if you order with
            your decal!
          </p>
        </div>

        <Image
          className="w-full h-auto max-h-full object-contain"
          src={'/2NDFlag.png'}
          alt={'Logo'}
          width={256}
          height={140}
          quality="85"
        />
      </div>

      <div className="grid grid-cols-9 gap-4 mb-4 p-2 bg-yellow-50 border-2 border-black border-dashed">
        <div className="col-span-5">
          <label className="mb-1 bg-yellow-200 px-2">
            <input
              id="fast"
              type="checkbox"
              name="fast"
              checked={fast}
              onChange={() => setFast(Math.abs(fast - 1))}
            />
            <span className="ml-2 text-green font-bold">
              Yes! Rush & Insure my Order
            </span>
          </label>
          <p className="text-red underline font-bold pt-2">
            ONE TIME OFFER (Only $1.99):
          </p>
        </div>

        <div className="col-span-4">
          <p className="text-sm">
            Put me in front of the shipping line: This will give your order
            priority in the fulfillment center
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <span className="font-bold">Item</span>
        <span className="font-bold">Price</span>
      </div>

      <hr />

      <div className="flex flex-row justify-between">
        <span>{decal} Hell No Joe Decal</span>
        <span>${(decal * 2.99).toFixed(2)}</span>
      </div>

      <div className="flex flex-row justify-between">
        <span>2nd Amendment Decal</span>
        <span>{flag === 1 ? '$3.99' : 'No'}</span>
      </div>

      <div className="flex flex-row justify-between">
        <span>Priority Shipping</span>
        <span>{fast === 1 ? '$1.99' : 'No'}</span>
      </div>

      <hr />

      <div className="flex flex-row justify-between mb-5">
        <span className="font-bold">Order Total</span>
        <span className="font-bold">${amount.toFixed(2)}</span>
      </div>

      {error && (
        <ErrorMessage>
          {error.message !== '' ? error.message : 'Payment Error'}
        </ErrorMessage>
      )}

      <div className="text-right mb-4">
        <button onClick={handlePrev} className="mr-0 md:mr-2 px-3 mb-3 md:mb-0">
          {'<<<'} Edit Shipping Details
        </button>

        <Button
          variant="slim"
          className={`SubmitButton ${
            error ? 'SubmitButton--error' : ''
          } text-xl`}
          onClick={handleSubmit}
          disabled={processing || !stripe}
        >
          {processing ? 'Processing...' : 'Claim My Decal >>>'}
        </Button>
      </div>
    </form>
  )
}

const stripePromise = loadStripe(
  'pk_live_51Iam9HDWUatLAMhy0y4DfIkhAAtKbClHQj0OQQ42jl3hfPO5GuP3K2IY45E5S1M7pveqnJtRg2Q1nGH24rHvXWeZ00FjMBUYvK'
)

// const stripePromise = loadStripe(
//   'pk_test_51Iam9HDWUatLAMhyMIlAr1UZ36ypGCrDRuWw3vg2p5a7Ks5xnIBtoq5WaSnLEdZXrNZ4NYGykboxiQfzKyfF4HY600hzp8lGpp'
// )

const Stripe = (props) => {
  return (
    <div className="AppWrapper">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          email={props.email}
          name={props.name}
          address1={props.address1}
          address2={props.address2}
          city={props.city}
          state={props.state}
          zip={props.zip}
          phone={props.phone}
          onClickPrev={props.onClickPrev}
        />
      </Elements>
    </div>
  )
}

export default Stripe
