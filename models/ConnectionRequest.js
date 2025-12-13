const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId, //newer, direct reference to the ObjectId class
      ref: "User", // join
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId, //older, traditional way
      ref: "User",
    },

    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is an incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    //or use toString
    throw new Error("Cannot send connection request to yourself!");
  }
  // next(); // not working
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
