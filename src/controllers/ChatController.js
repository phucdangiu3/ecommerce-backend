const ChatService = require("../services/ChatService");
const fetch = require("node-fetch");

// Cấu hình URL và API Key của Hugging Face
const HF_API_URL =
  "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"; // Đổi thành mô hình bạn muốn
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Lấy từ .env
console.log("API URL:", HF_API_URL);
console.log("API Key:", HF_API_KEY ? "Loaded" : "Missing");

// Gửi tin nhắn và nhận phản hồi từ AI
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Kiểm tra nếu tin nhắn rỗng
    if (!message) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Lưu tin nhắn người dùng vào database
    const userMessage = await ChatService.saveMessage(
      sender,
      receiver,
      message
    );

    // Gửi yêu cầu tới Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    // Kiểm tra nếu API trả về lỗi
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    // Xử lý dữ liệu trả về từ API
    const data = await response.json();
    let aiMessage =
      data[0]?.generated_text || "Sorry, I couldn't understand that.";

    console.log("Generated Text:", aiMessage);
    if (message.toLowerCase().includes("hello")) {
      aiMessage = "bye"; // Phản hồi tùy chỉnh khi người dùng nói "hello"
    } else if (message.toLowerCase().includes("bye")) {
      aiMessage = "Goodbye! Have a great day!"; // Phản hồi tùy chỉnh khi người dùng nói "bye"
    }
    // Lưu phản hồi của AI vào database
    const aiReply = await ChatService.saveMessage(
      receiver,
      sender,
      aiMessage,
      true
    );

    // Trả về kết quả
    res.status(200).json({ userMessage, aiReply });
  } catch (error) {
    console.error("Error in Hugging Face API call:", error.message);
    res.status(500).json({ error: "Failed to process AI message" });
  }
};

// Lấy lịch sử chat giữa hai người dùng
const getChatHistory = async (req, res) => {
  try {
    const { user1, user2 } = req.params; // Nhận ID hai người dùng từ URL
    const messages = await ChatService.getChatHistory(user1, user2); // Gọi service để lấy lịch sử
    res.status(200).json(messages); // Trả về dữ liệu lịch sử chat
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

module.exports = { getChatHistory, sendMessage };
