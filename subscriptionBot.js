require("dotenv").config();
const logger = require("./utils/logger");

const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.SUBSCRIPTIONBOT_TOKEN;
const url = process.env.HEROKU_URL;
const TZ = process.env.TZ;
const port = process.env.PORT || 8443;
const options = {
  webHook: {
    port,
  },
};

const fetchForecast = require("./utils/fetchForecast");
const composeForecast = require("./utils/composeForecast");
const onGetUserLocation = require("./utils/onGetUserLocation");

let subsCollection;
const attemptDB = async () => {
  const dbo = require("./db/conn");
  await dbo.connectToServer((err) => {
    if (err) {
      logger.error("Error connecting to MongoDB:", err);
      process.exit(1);
    } else {
      logger.info("Successfully connected to MongoDB.");
    }
  });
  const db = dbo.getDb();
  subsCollection = await db.collection("subs");
};

const CronJob = require("cron").CronJob;
let userData;
const subscription = {};
const onSendWeatherReport = async (msg, userData) => {
  let data;
  let chatId;
  const numberOfDays = 1;
  try {
    chatId = msg.chat.id;
    const coordinates = {
      lat: userData.coordinates.lat,
      lon: userData.coordinates.lon,
    };
    data = await fetchForecast(coordinates, numberOfDays);
    if (data === undefined) {
      await bot.sendMessage(chatId, "Weather server request error", {
        parse_mode: "HTML",
      });
      return;
    }
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  try {
    const weatherDataArray = await composeForecast(data);
    await bot.sendMessage(chatId, `Here is a forecast for next day`, {
      parse_mode: "HTML",
    });
    for (const weatherDataObject of weatherDataArray) {
      let weatherReport = "";
      weatherReport += "<b>Weather Forecast</b>\n";
      for (const key in weatherDataObject) {
        const value = weatherDataObject[key];
        weatherReport += "<i>" + key + "</i> - " + value + "\n";
        if (key === "time") weatherReport += "\n";
      }
      await bot.sendMessage(chatId, weatherReport, { parse_mode: "HTML" });
    }
  } catch (err) {
    logger.error(err);
  }
};

const establishConnection = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      bot = new TelegramBot(token, options);
      bot.setWebHook(`${url}bot${token}`, {
        certificate: options.webHook.cert,
      });
    } else {
      bot = new TelegramBot(token, { polling: true });
    }
    // throw new Error();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

establishConnection();

// eslint-disable-next-line
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await attemptDB();
  // console.log(subsCollection);
  try {
    bot.sendMessage(msg.chat.id, "Please share your location", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Share Location",
              request_location: true,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    });
  } catch (err) {
    logger.error(err);
  }

  userData = await onGetUserLocation(bot);
  subscription.coordinates = userData.coordinates;
  subscription.userName = msg.from.username;
  subscription.userId = msg.from.id;
  bot.sendMessage(chatId, "coordinates received", {
    reply_markup: {
      remove_keyboard: true,
    },
  });
  bot.sendMessage(
    chatId,
    "Please provide the time you want to schedule the task in the format 'hh:mm' using the 24-hour clock." +
      " For example, if you want to schedule the task for 3:30 PM, enter '15:30'.",
  );
});

let hour, minute;
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const timeRegex = /^\d{2}:\d{2}$/;

  if (timeRegex.test(message)) {
    // Handle messages that match the time format
    bot.sendMessage(chatId, "Thanks for sending the time!");
    [hour, minute] = message.split(":");
  }
  if (hour && minute) {
    subscription.hour = hour;
    subscription.minute = minute;
    const cronFunction = (chatId) => {
      onSendWeatherReport(msg, userData);
    };
    const job = new CronJob(
      `${minute} ${hour} * * *`,
      () => cronFunction(chatId),
      null,
      true,
      TZ,
    );
    subsCollection.insertOne(subscription);
    job.start();
  }
});
