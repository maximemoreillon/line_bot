import axios from "axios"

const { LINE_USER_ID, LINE_CHANNEL_ACCESS_TOKEN } = process.env

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
}

export const send_message_to_self = (message_text: string) => {
  const url = "https://api.line.me/v2/bot/message/push"

  const data = {
    to: LINE_USER_ID,
    messages: [{ type: "text", text: message_text }],
  }

  return axios.post(url, data, { headers })
}

export const send_response = (replyToken: string, text: string) => {
  const url = "https://api.line.me/v2/bot/message/reply"
  const data = {
    replyToken,
    messages: [{ type: "text", text }],
  }

  return axios.post(url, data, { headers })
}
