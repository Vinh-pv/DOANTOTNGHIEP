const mongoose = require("mongoose");

const UtilityBillSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    electricityBill: {
      type: Number,
      required: true,
    },
    waterBill: {
      type: Number,
      required: true,
    },
    paymentDay: {
      type: Date,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    status: {
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

module.exports = mongoose.model("UtilityBill", UtilityBillSchema);
