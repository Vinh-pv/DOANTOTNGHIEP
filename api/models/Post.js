const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  // photos: {
  //   type: [String],
  //   required: false,
  // },
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
  public_id: {
    type: String,
    required: false,
  },
  base64: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  }, 
  categories: {
    type: Array,
    required: false
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);