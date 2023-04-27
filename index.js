// require("dotenv").config();

// const TelegramBot = require("node-telegram-bot-api");
// // const token = process.env.TOKEN_THREEDOTONEABOUTMEBOT;
// const token = "6226322961:AAFUZl0yNlCXaeOjiwrIBgSOolk_OztvzSU";

// // let bot;

// // if (process.env.NODE_ENV === "production") {
// //   bot = new TelegramBot(token);
// //   // bot.setWebHook(process.env.HEROKU_URL + token);
// //   bot.setWebHook(
// //     `https://api.telegram.org/bot${token}/setWebhook?url=https://about-me-bot12.herokuapp.com/`,
// //   );
// //   // eslint-disable-next-line
// //   console.log(process.env.NODE_ENV);
// // } else {
// //   bot = new TelegramBot(token, { polling: true });
// // }

// const bot = new TelegramBot(token);
// // bot.setWebHook(process.env.HEROKU_URL + token);
// bot.setWebHook(
//   `https://api.telegram.org/bot${token}/setWebhook?url=https://about-me-bot12.herokuapp.com/`,
// );

// // eslint-disable-next-line

// bot.on("message", async (msg) => {
//   // eslint-disable-next-line
//   console.log(msg);
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "hello2");
// });
// //
// // // eslint-disable-next-line
// // bot.onText(/\about/, (msg) => {
// //   const reply = "about";
// //   const chatId = msg.chat.id;
// //   bot.sendMessage(chatId, reply);
// // });
// // // eslint-disable-next-line
// // bot.onText(/\links/, (msg) => {
// //   const reply = "links";
// //   const chatId = msg.chat.id;
// //   bot.sendMessage(chatId, reply);
// // });
// // // eslint-disable-next-line
// // bot.onText(/\start/, (msg) => {
// //   const reply = "start";
// //   const chatId = msg.chat.id;
// //   bot.sendMessage(chatId, reply);
// // });
// // // eslint-disable-next-line
// // bot.onText(/\help/, (msg) => {
// //   const reply = "help2";
// //   const chatId = msg.chat.id;
// //   bot.sendMessage(chatId, reply);
// // });

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const port = process.env.PORT || 5000;
const token = "6226322961:AAFUZl0yNlCXaeOjiwrIBgSOolk_OztvzSU";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);
bot.startWebhook(`/${token}`, null, port);
bot.telegram.setWebhook(`https://about-me-bot12.herokuapp.com/bot${token}`);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the Bot API." });
});
app.post("/", (req, res) => {
  res.status(200).json({ message: "Hello from the Bot API." });
});
app.post(`/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.status(200).json({ message: "ok" });
});
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`\n\nServer running on port ${port}.\n\n`);
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});
// eslint-disable-next-line
console.log(`Server running on port ${port}`);
