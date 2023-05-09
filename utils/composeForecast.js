require("dotenv").config();

const composeForecast = async (data) => {
  const forecastStamps = data.list;
  return forecastStamps.map((forecastStamp) => {
    const dateTimeMilliseconds = new Date(forecastStamp.dt * 1000);
    const date =
      String(dateTimeMilliseconds.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(dateTimeMilliseconds.getDate()).padStart(2, "0") +
      "-" +
      String(dateTimeMilliseconds.getFullYear());
    const time =
      String(dateTimeMilliseconds.getHours()).padStart(2, "0") + ":00";
    return {
      city: data.city.name + ", " + data.city.country,
      time: date + ", " + time,
      weather: forecastStamp.weather[0].main,
      description: forecastStamp.weather[0].description,
      temp: forecastStamp.main.temp + "°C",
      wind: forecastStamp.wind.speed + " m/s",
      humidity: forecastStamp.main.humidity + "%",
    };
  });
};

module.exports = composeForecast;
