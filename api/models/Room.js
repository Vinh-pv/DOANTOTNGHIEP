const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  photos: [
    {
      src: {
        type: String,
      },
      base64: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  ],
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
    required: false
  },
  status: {
    type: Boolean,
    default: false
  },
  maxUser: {
    type: Number,
    default: 8
  },
  used: {
    type: Number,
    default: 0
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);