const handleHelp = async (chatId, bot) => {
  bot.sendMessage(chatId, "Welcome", {
    reply_markup: {
      keyboard: [["/location", "/sub", "/unsub"]],
    },
  });
};

module.exports = handleHelp;
