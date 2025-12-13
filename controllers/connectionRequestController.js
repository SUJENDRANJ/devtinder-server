const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const sendConnection = async (req, res) => {
  try {
    const fromUser = req.user;
    const fromUserId = fromUser._id;
    const { toUserId, status } = req.params;

    // console.log(fromUserId.toString(), toUserId);

    const allowedFields = ["interested", "ignored"];

    if (!allowedFields.includes(status))
      throw new Error(status + " is not valid");

    //check id is in db
    const toUser = await User.findById(toUserId);
    if (!toUser) throw new Error("User doesn't Exist");

    // already requested
    const alreadyConnected = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (alreadyConnected) throw new Error("Already interested");

    const newConnection = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await newConnection.save();

    res.status(200).json({
      message: `${
        fromUser.firstName +
        " is " +
        (status === "ignored" ? "not interested" : "interested") +
        " in " +
        toUser.firstName
      }`,
      data: newConnection,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const reviewConnection = async (req, res) => {
  try {
    const allowedFields = ["rejected", "accepted"];
    const { requestId, status } = req.params;

    const loggedInUserId = req.user._id;

    if (!allowedFields.includes(status))
      throw new Error(status + " is not valid");

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      const err = new Error("Connection request not found");
      err.statusCode = 404;

      throw err;
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    res.status(200).json({
      message: `${status} the connection request`,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

module.exports = { sendConnection, reviewConnection };
