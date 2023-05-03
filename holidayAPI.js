require("dotenv").config();
// const logger = require("./utils/logger");

const apiKey = process.env.ABSTRACTAPI_TOKEN;

const today = new Date();
const date = {
  day: String(today.getDate()).padStart(2, "0"),
  month: String(today.getMonth() + 1).padStart(2, "0"),
  year: today.getFullYear(),
};

const fetchData = async (country) => {
  const fetchURL =
    `https://holidays.abstractapi.com/v1/?api_key=${apiKey}` +
    `&country=${country}&year=${date.year}&month=${date.month}` +
    `&day=${date.day}`;
  const response = await fetch(fetchURL);
  const result = await response.json();
  return result;
};

module.exports = fetchData;
