const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: Array,
  },
  like: {
    type: Array,
 
  },

  dislike: {
    type: Array,
    required: true,
   
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("Post", PostSchema);
