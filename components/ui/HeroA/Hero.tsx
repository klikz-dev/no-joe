import React, { FC, useState } from 'react'
import Image from 'next/image'
import { Input } from '@components/ui'
import Button from '../Button'
import Address from '../Address'
import PaymentA from '../PaymentA'
import axios from 'axios'

interface Props {
  className?: string
  headline: string
  description: string
  cRef: any
}

const Hero: FC<Props> = ({ headline, description, cRef }) => {
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const [error, setError] = useState('')
  const [nextForm, setNextForm] = useState(false)

  const [newsletter, setNewsletter] = useState(true)

  const handleAddressChange = (address: any) => {
    setStreet1(address)
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleAddressSelect = (address: any) => {
    let street_number = '',
      route = '',
      city = '',
      state = '',
      zip = ''

    address[0].address_components.forEach((element: any) => {
      if (element.types[0] === 'street_number') {
        street_number = element.long_name
      }
      if (element.types[0] === 'route') {
        route = element.long_name
      }
      if (element.types[0] === 'locality') {
        city = element.long_name
      }
      if (element.types[0] === 'administrative_area_level_1') {
        state = element.long_name
      }
      if (element.types[0] === 'postal_code') {
        zip = element.long_name
      }
    })

    setStreet1(street_number + ' ' + route)
    setCity(city)
    setState(state)
    setZip(zip)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setError('')

    await axios.post('/api/drip/create', {
      email: email,
      name: name,
      other: newsletter,
    })

    await axios.post('/api/postscript/create', {
      phone: phone,
      email: email,
      other: newsletter,
    })

    setNextForm(true)
  }

  const handleCheckout = (e: any) => {
    e.preventDefault()

    setError('')
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute min-h-screen z-0 h-full w-full top-0">
        <Image
          className="w-full h-auto md:h-full object-cover"
          src={'/us-flag-bg.jpg'}
          alt={'Logo'}
          quality="85"
          layout="fill"
        />
      </div>

      <div className="relative z-10">
        <div className="h-full max-w-7xl min-h-screen mx-auto bg-black bg-opacity-40">
          <div className="grid grid-cols-1 md:grid-cols-2 py-8 md:py-20">
            <div className="max-w-xl mx-auto text-center md:pt-5">
              <h2 className="text-3xl leading-10 font-extrabold text-white sm:text-4xl sm:leading-none sm:tracking-tight">
                {headline}
              </h2>

              <p className="my-5 text-3xl leading-7 text-accent-2 text-white">
                {description}
              </p>

              <div className="px-8">
                <Image
                  className="w-full h-auto max-h-full object-contain"
                  src={'/Space-Force-JFK-con.png'}
                  alt={'Logo'}
                  width={450}
                  height={640}
                  quality="85"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="max-w-xl mx-auto p-2">
                <div className="shadow-lg">
                  <div
                    className="bg-red text-white text-center font-bold text-2xl p-4"
                    ref={cRef}
                  >
                    <h4>Claim Your “Hell No Joe" Decal. Just Pay S&H! </h4>
                  </div>
                  <div className="bg-white p-4">
                    <form
                      onSubmit={handleSubmit}
                      className={nextForm ? 'hidden' : ''}
                    >
                      <Input
                        className="mb-4"
                        required
                        id="name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e)}
                        placeholder="Full Name..."
                      />
                      <Input
                        className="mb-4"
                        required
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e)}
                        placeholder="Email Address..."
                      />
                      <Input
                        className="mb-4"
                        required
                        id="phone"
                        type="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e)}
                        placeholder="Phone Number..."
                      />

                      <hr className="mb-4" />

                      <div className="mb-4">
                        <Address
                          onChange={(e) => handleAddressChange(e)}
                          onSelect={(e) => handleAddressSelect(e)}
                        />
                      </div>

                      <Input
                        className="mb-4"
                        id="street2"
                        type="text"
                        name="street2"
                        placeholder="Apt., Bulding, Floor, etc..."
                        value={street2}
                        onChange={(e) => setStreet2(e)}
                      />
                      <Input
                        className="mb-4"
                        required
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City..."
                        value={city}
                        onChange={(e) => setCity(e)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          className="mb-4"
                          required
                          id="state"
                          type="text"
                          name="state"
                          placeholder="State..."
                          value={state}
                          onChange={(e) => setState(e)}
                        />
                        <Input
                          className="mb-4"
                          required
                          id="zip"
                          type="text"
                          name="zip"
                          placeholder="Zip..."
                          value={zip}
                          onChange={(e) => setZip(e)}
                        />
                      </div>

                      {error !== '' && (
                        <p className="text-red mb-2 text-right">{error}</p>
                      )}

                      <div className="text-right mb-4">
                        <Button type="submit" className="text-xl">
                          Claim My Decal {'>>>'}
                        </Button>
                      </div>

                      <p className="px-3 text-center text-gray-400 text-sm mb-2">
                        By clicking the button above, you are giving Liberty
                        Apparel permission to send you exclusive deals and
                        newsletters via email and SMS. Msg&data rates apply.
                        Reply STOP to cancel.
                      </p>

                      <div className="text-center">
                        <label className="mb-2 text-gray-400">
                          <input
                            id="newsletter"
                            type="checkbox"
                            name="newsletter"
                            checked={newsletter}
                            onChange={() => setNewsletter(!newsletter)}
                          />
                          <span className="text-sm">
                            {' '}
                            Subscribe to our other two email lists, Proud
                            Patriots and Conservative Consumer. By checking this
                            box you are giving us permission to subscribe you to
                            all three of our email lists: Liberty Apparel, Proud
                            Patriots, and Conservative Consumer.
                          </span>
                        </label>
                      </div>
                    </form>

                    <form
                      onSubmit={handleCheckout}
                      className={!nextForm ? 'hidden' : ''}
                    >
                      <PaymentA
                        email={email}
                        name={name}
                        address1={street1}
                        address2={street2}
                        phone={phone}
                        city={city}
                        state={state}
                        zip={zip}
                        onClickPrev={() => setNextForm(false)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
