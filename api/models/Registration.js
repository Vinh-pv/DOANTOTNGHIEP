const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    semester: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    startEnd: {
      type: Date,
      required: true,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    dateConfirm: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
