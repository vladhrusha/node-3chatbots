require("dotenv").config();

const openWeatherMapKey = process.env.OPENWEATHERMAPAPI_TOKEN;

const fetchForecast = async (coordinates, numberOfDays) => {
  const fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${
    coordinates.lat
  }&lon=${coordinates.lon}&appid=${openWeatherMapKey}&units=metric&cnt=${
    numberOfDays * 8
  }`;
  const response = await fetch(fetchURL);
  return await response.json();
};

module.exports = fetchForecast;
