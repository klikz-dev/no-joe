const Shopify = require('shopify-api-node')

const shopify = new Shopify({
  shopName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_SEC,
})

export default async function createOrder(req: any, res: any) {
  const email = req.body.email
  const variant = req.body.variant
  const quantity = req.body.quantity

  const name = req.body.name
  const address1 = req.body.address1
  const address2 = req.body.address2
  const phone = req.body.phone
  const city = req.body.city
  const province = req.body.state
  const zip = req.body.zip

  const first_name = name.split(' ')[0]
  const last_name = name.split(' ')[1]

  let line_items = [
    {
      variant_id: variant,
      quantity: quantity,
    },
  ]

  const data = {
    line_items: line_items,
    customer: {
      first_name: first_name,
      last_name: last_name,
      email: email,
    },
    billing_address: {
      first_name: first_name,
      last_name: last_name,
      address1: address1,
      address2: address2,
      phone: phone,
      city: city,
      province: province,
      country: 'US',
      zip: zip,
    },
    shipping_address: {
      first_name: first_name,
      last_name: last_name,
      address1: address1,
      address2: address2,
      phone: phone,
      city: city,
      province: province,
      country: 'US',
      zip: zip,
    },
    tags: 'nextjs, subscription',
    email: email,
  }

  try {
    const orderData = await shopify.order.create(data)
    res.json(orderData.data)
  } catch (error) {
    res.status(500).send(error)
  }
}
