const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
dotenv.config();
mongoose.set("strictQuery", false);
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

routes(app);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // Phát tin nhắn tới tất cả client
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Connect to MongoDB without deprecated options
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Db success!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.listen(port, () => {
  console.log("Server is running on port:", port);
});
