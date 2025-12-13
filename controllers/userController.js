const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

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

const feed = async (req, res) => {
  //pagination
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = limit * (page - 1);

  try {
    const loggedInUser = req.user;

    //connection
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }) //No need for $and explicitly, MongoDB automatically treats multiple key-value conditions as AND.
      // .populate("fromUserId toUserId")
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const arrayOfHideUsersFromFeed = Array.from(hideUsersFromFeed); //or
    // const arrayOfHideUsersFromFeed = [...hideUsersFromFeed]; /

    const userInFeed = await User.find({
      $and: [
        { _id: { $nin: arrayOfHideUsersFromFeed } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // also can do
    // const userInFeed = await User.find({
    // _id: {
    //   $nin: [...hideUsersFromFeed],
    //   $ne: loggedInUser._id
    // }

    res.status(200).json({
      message: userInFeed,
    });
  } catch (err) {
    res.status(500).json({
      error: "There are no users found",
    });
  }
};

module.exports = { allRequests, allConnections, feed };
