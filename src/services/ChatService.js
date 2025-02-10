const ChatModel = require("../models/ChatModel");

// Lưu tin nhắn vào database
const saveMessage = async (sender, receiver, message, isAIResponse = false) => {
  return await ChatModel.create({ sender, receiver, message, isAIResponse });
};

// Lấy lịch sử chat giữa hai người dùng
const getChatHistory = async (user1, user2) => {
  return await ChatModel.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ createdAt: 1 }); // Lấy tin nhắn theo thứ tự thời gian
};

module.exports = { saveMessage, getChatHistory };
