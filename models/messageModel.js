const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    users: [String],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;
