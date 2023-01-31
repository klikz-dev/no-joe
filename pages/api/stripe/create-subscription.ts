const stripe = require('stripe')(process.env.STRIPE_SEC_KEY_LIVE)

export default async function createPaymentIntent(req: any, res: any) {
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    })
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } })
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(req.body.customerId, {
    invoice_settings: {
      default_payment_method: req.body.paymentMethodId,
    },
  })

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    expand: ['latest_invoice.payment_intent'],
  })

  res.send(subscription)
}
