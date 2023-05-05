require("dotenv").config();
const logger = require("./logger");

const openWeatherMapKey = process.env.OPENWEATHERMAPAPI_TOKEN;

const fetchForecast = async (coordinates) => {
  try {
    const fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherMapKey}&units=metric`;
    const response = await fetch(fetchURL);
    return await response.json();
  } catch (error) {
    logger.error(error);
  }
};

module.exports = fetchForecast;
