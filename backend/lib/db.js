const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Mongo connect ${conn.connection.host}`);
  } catch (error) {
    console.log("Connect Error", error);
  }
};
module.exports = connectDB;
