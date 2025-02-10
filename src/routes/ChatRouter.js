const express = require("express");
const ChatController = require("../controllers/ChatController");

const router = express.Router();

// Định nghĩa các route
router.get("/:user1/:user2", ChatController.getChatHistory); // Lấy lịch sử chat
router.post("/", ChatController.sendMessage); // Gửi tin nhắn

module.exports = router;
