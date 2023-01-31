const stripe = require('stripe')(process.env.STRIPE_SEC_KEY_LIVE)

export default async function createPaymentIntent(req: any, res: any) {
  const amount = req.body.amount
  const customer = req.body.customer
  const payment_method = req.body.payment_method

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      customer: customer,
      payment_method: payment_method,
      currency: 'usd',
      off_session: true,
      confirm: true,
    })

    if (paymentIntent.error) {
      res.status(500).send(paymentIntent.error)
    } else {
      res.json(paymentIntent.client_secret)
    }
  } catch (error) {
    res.status(500).send(error)
  }
}
