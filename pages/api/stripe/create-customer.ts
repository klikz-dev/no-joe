const stripe = require('stripe')(process.env.STRIPE_SEC_KEY_LIVE)

export default async function createPaymentIntent(req: any, res: any) {
  const email = req.body.email
  const payment_method = req.body.payment_method

  try {
    const customer = await stripe.customers.create({
      email: email,
      payment_method: payment_method,
    })

    if (customer.error) {
      res.status(500).send(customer.error)
    } else {
      res.json(customer)
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
