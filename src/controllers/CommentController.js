const CommentService = require("../services/CommentService");
const createComment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { content, productId, userId } = req.body;

    if (!content || !productId || !userId) {
      return res.status(400).json({
        status: "ERR",
        message: "Content, productId, and userId are required",
      });
    }
    const response = await CommentService.createComment(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message || "Unknown error occurred",
      error: e, // Trả về toàn bộ lỗi để debug
    });
  }
};
const getDetailsComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!commentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The commentId is required",
      });
    }
    const response = await CommentService.getDetailsComment(commentId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createComment,
  getDetailsComment,
};
