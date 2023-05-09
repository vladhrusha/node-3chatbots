const onGetUserLocation = (bot) => {
  return new Promise((resolve) => {
    bot.on("location", async (msg) => {
      const coordinates = {
        lat: msg.location.latitude,
        lon: msg.location.longitude,
      };
      resolve({ coordinates });
    });
  });
};

module.exports = onGetUserLocation;
