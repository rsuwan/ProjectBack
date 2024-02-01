import Post from "../../../db/modle/post.modle.js";
import User from "../../../db/modle/User.modle.js";
import Message from "../../../db/modle/message.modle.js";

export const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, postId } = req.params;
    const { content } = req.body;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const post = await Post.findById(postId);
    if (!sender || !receiver || !post) {
      return res
        .status(404)
        .json({ message: "Invalid sender, receiver, or post." });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      post: post._id,
      content,
    });

    const savedMessage = await newMessage.save();
   sender.messages.push(savedMessage._id);
    receiver.messages.push(savedMessage._id);
    await sender.save();
    await receiver.save();
    return res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: "Error creating message." });
  }
};

export const getPostMessages = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const messages = await Message.find({ post: post._id }).populate(
      "sender receiver"
    );
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages for post:", error);
    return res.status(500).json({ message: "Error fetching messages." });
  }
};
