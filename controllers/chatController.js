const Chat = require("../models/Chat");

const chatMessages = async (req, res) => {
  try {
    // const { targetUserId } = req.params;
    const { targetUserId } = req.body;
    const { _id } = req.user;

    if (!_id || !targetUserId || _id.equals(targetUserId)) {
      return res.status(400).json({ error: "Invalid users" });
    }

    //get chat
    let chat = await Chat.findOne({
      pariticipants: { $all: [_id, targetUserId] },
    })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });

    //no chat found
    if (!chat) {
      chat = new Chat({
        participants: [_id, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    //chat found

    res.status(200).json({ message: "", data: chat });
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};

module.exports = { chatMessages };
