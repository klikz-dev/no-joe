export default async function createSubscriber(req: any, res: any) {
  const phone = req.body.phone
  const email = req.body.email
  const other = req.body.other

  var axios = require('axios')

  try {
    const phonesData = await axios({
      method: 'post',
      url: 'https://api.postscript.io/v1/subscribers',
      headers: {
        Authorization: process.env.POSTSCRIPT_SECRET_KEY,
        'Content-Type': 'application/json',
        'X-Postscript-Shop-Token': process.env.POSTSCRIPT_ACCESS_TOKEN,
      },
      data: {
        phone_number: phone,
        keyword_id: process.env.POSTSCRIPT_KEYWORD_ID,
        metadata: {
          tags: `HELLNOJOE${other ? ',OTHER' : ''}`,
          email_address: email,
        },
      },
    })

    res.status(200).send(phonesData.data)
  } catch (error) {
    res.status(500).send(error)
  }
}
