const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      minlength: 5,
    },
    fullName: {
      type: String,
      unique: true,
      maxlength: 30,
      minlength: 5,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
