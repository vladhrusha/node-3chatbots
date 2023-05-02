require("dotenv").config();
const pino = require("pino");
let loggerConfig = {};

if (process.env.PRETTY_LOGGING === "true") {
  loggerConfig = {
    transport: {
      target: "pino-pretty",
    },
  };
}
const logger = pino(loggerConfig);

module.exports = logger;
