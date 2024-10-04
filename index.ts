import dotenv from "dotenv"
dotenv.config()
import express from "express"
import "express-async-errors"
import cors from "cors"
import createHttpError from "http-errors"
import legacyAuth from "@moreillon/express_identification_middleware"
import oidcAuth from "@moreillon/express-oidc"
import { version, author } from "./package.json"
import { send_response, send_message_to_self } from "./utils"
import { Request, Response } from "express"

const { APP_PORT = 80, IDENTIFICATION_URL, OIDC_JWKS_URI } = process.env

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send({
    application_name: "Line Bot",
    author,
    version,
    auth: {
      IDENTIFICATION_URL,
      OIDC_JWKS_URI,
    },
  })
})

app.post("/webhook", async (req, res) => {
  // Return a response to acknowledge receipt of the event
  res.sendStatus(200)

  // Placeholder reply for messages
  try {
    const {
      message: { text },
      replyToken,
    } = req.body.events[0]
    await send_response(replyToken, `Your message: ${text}`)
  } catch (error) {
    console.error(error)
  }
})

if (OIDC_JWKS_URI) app.use(oidcAuth({ jwksUri: OIDC_JWKS_URI }))
else if (IDENTIFICATION_URL) app.use(legacyAuth({ url: IDENTIFICATION_URL }))

app.post("/notify", async (req, res) => {
  const { message } = req.body
  if (!message) throw createHttpError(400, "Message not defined")
  await send_message_to_self(message)
  res.send({ message })
})

app.listen(APP_PORT, () => {
  console.log(`[Express] listening on port ${APP_PORT}`)
})
