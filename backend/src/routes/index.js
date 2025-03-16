const authRoute = require("./auth.route");
const messageRoute = require('./message.route')

const Route = (app) => {
  app.use("/v1/auth", authRoute);
  app.use("/v1/message", messageRoute)
};
module.exports = Route;
