const ConnectionRequest = require("../models/ConnectionRequest");

// const USER_SAFE_DATA = ["firstName", "lastName"]; //or String
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const allRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const interestedUsers = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    // if (interestedUsers.length == 0) {
    //   const err = new Error("There is no Interested Users"); // no user = not an error
    //   err.status = 404;
    //   throw err;
    // }

    res.status(200).json({
      message: interestedUsers.length
        ? "Data fetched successfully"
        : "No requests found",
      count: interestedUsers.length,
      data: interestedUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const toUserId = loggedInUser._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId, status: "accepted" },
        { fromUserId: toUserId, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_SAFE_DATA);

    const connectedUsers = connections.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString() // or .equals()
        ? row.toUserId
        : row.fromUserId
    );

    res.status(200).json({
      message: !connections.length
        ? "No Connections found"
        : "Data fetched successfully",
      count: connections.length,
      data: connectedUsers,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch connections",
    });
  }
};

module.exports = { allRequests, allConnections };
