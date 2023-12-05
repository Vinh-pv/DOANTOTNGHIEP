const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: Number,
      required: false,
    },
    mssv: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
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

module.exports = mongoose.model("Contact", ContactSchema);
