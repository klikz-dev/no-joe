export default async function createSubscriber(email: any) {
  const axios = require('axios').default
  const result = await axios({
    method: 'post',
    url: 'https://api.getdrip.com/v2/6195798/subscribers',
    data: {
      subscribers: [{ email: email }],
    },
    headers: {
      Authorization: 'Bearer b1dcf428884f4a8565b2ace46a09f1d6',
      'Content-Type': 'application/json',
    },
  })

  return result
}
