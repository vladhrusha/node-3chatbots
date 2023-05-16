const logger = require("./logger");
const fetchForecast = require("./fetchForecast");
const composeForecast = require("./composeForecast");

const onSendWeatherReport = async (chatId, coordinates, bot) => {
  let data;
  const numberOfDays = 1;
  try {
    // console.log(coordinates);
    data = await fetchForecast(coordinates, numberOfDays);
    // console.log(data);

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
module.exports = onSendWeatherReport;
