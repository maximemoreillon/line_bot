const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const createHttpError = require('http-errors')
const auth = require('@moreillon/express_identification_middleware')
const {version, author} = require('./package.json')

const {
  send_response,
  send_message_to_self
} = require('./utils')


dotenv.config()

// Port config
const {
  APP_PORT = 80,
  IDENTIFICATION_URL
} = process.env


const app = express()
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send({
    application_name: 'Line Bot',
    author,
    version,
    identification_url: IDENTIFICATION_URL || 'undefined'
  })
})



app.post('/webhook', async (req, res, next) => {
  // Webhook used by LINE

  // Return a response to acknowledge receipt of the event
  res.sendStatus(200)

  // Placeholder reply for messages
  try {
    const { message: { text }, replyToken } = req.body.events[0]
    await send_response(replyToken, `Your message: ${text}`)
  } catch (error) {
    console.error(error)
  }


  

})

const auth_options = { url: IDENTIFICATION_URL }


app.post('/notify', auth(auth_options), async (req, res, next) => {


  try {
    const { message } = req.body
    if (!message) throw createHttpError(400, 'Message not defined')
    await send_message_to_self(message)
    res.send({ message })
  }
  catch (error) {
    next(error)
  }
  
})

app.listen(APP_PORT, () => {
  console.log(`[Express] listening on port ${APP_PORT}`)
})
