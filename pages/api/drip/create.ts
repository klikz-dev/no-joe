export default async function createSubscriber(req: any, res: any) {
  const email = req.body.email
  const name = req.body.name
  var axios = require('axios')

  var data = JSON.stringify({
    subscribers: [
      {
        email: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1],
      },
    ],
  })

  var config = {
    method: 'post',
    url: `https://api.getdrip.com/v2/${process.env.DRIP_ACCOUNT_ID}/subscribers`,
    headers: {
      Authorization: process.env.DRIP_ACESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: data,
  }

  const result = await axios(config)
  if (result.error) {
    res.status(500).send(result.error)
  } else {
    res.status(200).json(result.data)
  }
}
