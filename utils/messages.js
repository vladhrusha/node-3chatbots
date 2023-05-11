const requestLocation = async (bot, chatId) => {
  bot.sendMessage(chatId, "Please share your location", {
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
};

const respondLocation = async (bot, chatId) => {
  await bot.sendMessage(chatId, "Received Coordinates", {
    reply_markup: {
      remove_keyboard: true,
    },
  });
};

const requestTime = async (bot, chatId, isSubscribing) => {
  if (isSubscribing) {
    await bot.sendMessage(
      chatId,
      "Please provide the time in UTC timezone that you want <b> to schedule the task </b> in the format 'hh:mm' using the 24-hour clock." +
        " For example, if you want to schedule the task for 3:30 PM, enter '15:30'.",
      { parse_mode: "HTML" },
    );
  } else if (!isSubscribing) {
    await bot.sendMessage(
      chatId,
      "Please provide the time in UTC timezone that you want to <b> delete the existing subscription </b> in the format 'hh:mm' using the 24-hour clock." +
        " For example, if you want to schedule the task for 3:30 PM, enter '15:30'.",
      { parse_mode: "HTML" },
    );
  }
};

module.exports = {
  requestLocation,
  respondLocation,
  requestTime,
};
