require("dotenv").config();

const openWeatherMapKey = process.env.OPENWEATHERMAPAPI_TOKEN;

const fetchForecast = async (coordinates) => {
  const fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${openWeatherMapKey}&units=metric`;
  const response = await fetch(fetchURL);
  return await response.json();
};

module.exports = fetchForecast;
