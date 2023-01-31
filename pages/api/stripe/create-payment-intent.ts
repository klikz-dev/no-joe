const stripe = require('stripe')(process.env.STRIPE_SEC_KEY_LIVE)

export default async function createPaymentIntent(req: any, res: any) {
  const amount = req.body.amount

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
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
