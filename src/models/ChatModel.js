const mongoose = require("mongoose");

// Định nghĩa schema cho tin nhắn
const ChatSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // ID hoặc tên người gửi
    receiver: { type: String, required: true }, // ID hoặc tên người nhận
    message: { type: String, required: true }, // Nội dung tin nhắn
    isAIResponse: { type: Boolean, default: false }, // Tin nhắn có phải từ AI không
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Xuất model Chat
module.exports = mongoose.model("Chat", ChatSchema);
