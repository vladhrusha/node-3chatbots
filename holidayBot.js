require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.HOLIDAYBOT_TOKEN;
const url = process.env.HEROKU_URL;
const logger = require("./utils/logger");
const countryFlagEmoji = require("country-flag-emoji");
const { flag, name, code } = require("country-emoji");

const fetchData = require("./holidayAPI");

const countries = ["JP", "AL", "BE", "HR", "DK", "PE", "QA", "NO"];
const countriesFlags = [];
countries.forEach(async (country) => {
  const countryData = await countryFlagEmoji.get(country);
  const countryUnicode = countryData.unicode;
  const unicodeSplit = countryUnicode.split(" ");
  unicodeSplit.forEach((element, ind) => {
    const index = element.indexOf("+");
    unicodeSplit[ind] = element.substring(index + 1);
  });
  const codePoints = unicodeSplit.map((element) => parseInt(element, 16));
  // eslint-disable-next-line
  const countryFlag =
    String.fromCodePoint(...codePoints) + " " + countryData.name;
  countriesFlags.push(flag(countryData.name));
});

const establishConnection = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      bot = new TelegramBot(token);
      bot.setWebHook(`${url}${token}`);
    } else {
      bot = new TelegramBot(token, { polling: true });
    }
    // throw new Error();
  } catch (err) {
    logger.error(err);
  }
};

establishConnection();
// eslint-disable-next-line
function toUnicodeString(emojiString) {
  let unicodeString = "";
  for (let i = 0; i < emojiString.length; i++) {
    const codePoint = emojiString.codePointAt(i);
    const hexString = codePoint.toString(16).toUpperCase();
    unicodeString += `U+${hexString} `;
    if (codePoint > 0xffff) {
      i++;
    }
  }
  return unicodeString.trim();
}

bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const input = code(msg.text);

    if (countries.includes(input)) {
      const data = await fetchData(input);
      if (data.length > 0) {
        const reply = data[0].name;
        await bot.sendMessage(chatId, name(input) + " - " + reply);
        const countryData = await countryFlagEmoji.get(input);
        const countryUnicode = countryData.unicode;
        const unicodeSplit = countryUnicode.split(" ");
        unicodeSplit.forEach((element, ind) => {
          const index = element.indexOf("+");
          unicodeSplit[ind] = element.substring(index + 1);
        });
        const codePoints = unicodeSplit.map((element) => parseInt(element, 16));
        // eslint-disable-next-line
        const countryFlag = String.fromCodePoint(...codePoints);

        // await bot.sendMessage(chatId, countryFlag);
      } else
        await bot.sendMessage(chatId, name(input) + " - " + "not a holiday");
    }
  } catch (err) {
    logger.error(err);
  }
}); // eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  try {
    const reply = "Here is the list";
    const chatId = msg.chat.id;

    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [countriesFlags],
      }),
    };
    await bot.sendMessage(chatId, reply, opts);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = bot;
