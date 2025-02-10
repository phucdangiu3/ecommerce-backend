const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authMiddleWare } = require("../middleware/authMiddleware"); // Middleware xác thực

router.post("/create", CommentController.createComment); // Tạo comment mới
router.get("/get-details/:id", CommentController.getDetailsComment); // Lấy danh sách comment theo postId

module.exports = router;
