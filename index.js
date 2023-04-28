const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const port = process.env.PORT || 5000;
const token = "6226322961:AAFUZl0yNlCXaeOjiwrIBgSOolk_OztvzSU";

let bot;
if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(`https://about-me-bot12.herokuapp.com/${token}`);
} else {
  bot = new TelegramBot(token, { polling: true });
}

app.use(express.json());

app.get("/", (req, res) => {
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

// eslint-disable-next-line
bot.onText(/\about/, (msg) => {
  const reply = "My name is Vlad";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\links/, (msg) => {
  const chatId = msg.chat.id;
  const mySocials = {};
  mySocials.linkedIn = "https://www.linkedin.com/in/vladyslavhrusha/";
  mySocials.facebook = "https://www.facebook.com/vladyslav.hrusha";
  const reply = `Welcome, here are my social links \n
  - LinkenIn - ${mySocials.linkedIn}\n
  - Facebook - ${mySocials.facebook}`;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\help/, (msg) => {
  const reply = "Here is the list";
  const chatId = msg.chat.id;

  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ["/start - start bot"],
        ["/help - list all commands"],
        ["/links - provide my social links"],
        ["/about - provide short info about me"],
      ],
    }),
  };
  bot.sendMessage(chatId, reply, opts);
});

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, "Received your message");
// });
