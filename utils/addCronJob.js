const onSendWeatherReport = require("./onSendWeatherReport");
const CronJob = require("cron").CronJob;
require("dotenv").config();
const TZ = process.env.TZ;

const addCronJob = async (msg, bot, hour, minute, userData) => {
  if (hour !== undefined && minute !== undefined) {
    const job = new CronJob(
      `${minute} ${hour} * * *`,
      () => onSendWeatherReport(msg, userData, bot),
      null,
      true,
      TZ,
    );
    await job.start();
  }
};
module.exports = addCronJob;
