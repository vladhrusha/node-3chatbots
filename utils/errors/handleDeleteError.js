const handleDeleteError = async (err, bot, chatId) => {
  if (err.message === "there is nothing to delete") {
    await bot.sendMessage(chatId, "there is nothing to delete");
  }
};

module.exports = handleDeleteError;
