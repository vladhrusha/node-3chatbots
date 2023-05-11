const Subscription = require("./subscriptionSchema");
// eslint-disable-next-line
const mongose = require("./conn");

const updateLocation = async (username, lat, lon) => {
  await Subscription.updateMany(
    { userName: username },
    { $set: { "coordinates.lat": lat, "coordinates.lon": lon } },
  );
};

module.exports = updateLocation;
