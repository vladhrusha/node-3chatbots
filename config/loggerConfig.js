require("dotenv").config();

let loggerConfig = {};

if (process.env.PRETTY_LOGGING === "true") {
  loggerConfig = {
    transport: {
      target: "pino-pretty",
    },
  };
}

module.exports = loggerConfig;
