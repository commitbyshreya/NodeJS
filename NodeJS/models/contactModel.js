const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    // this id refers to the user's id who owns this contact
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    name: {
      type: String,
      required: [true, "Please add the contact name"],
    },
    phone: {
      type: Number,
      required: [true, "Please add the number"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
