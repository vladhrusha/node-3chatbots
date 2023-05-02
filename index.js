const express = require("express");
const app = express();
require("dotenv").config();
const logger = require("./utils/logger");

const port = process.env.PORT || 5000;
const token = process.env.TELEGRAM_TOKEN;

// const bot = require("./bot");
const bot = require("./holidayBot");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the Bot API." });
});

app.post(`/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.status(200).json({ message: "ok" });
});
app.listen(port, () => {
  logger.info(`\n\nServer running on port ${port}.\n\n`);
});
