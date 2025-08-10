const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const connectMongoDB = require("./src/configs/database.config");

const authRoute = require("./src/routes/auth.route");
const chatRoute = require("./src/routes/chat.route");
const statusRoute = require("./src/routes/status.route");

const initializeSocket = require("./src/services/socket.service");
const http = require("http");

dotenv.config();

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOption));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket middleware
const server = http.createServer(app);
const io = initializeSocket(server);
app.use((req, res, next) => {
  req.io = io;
  req.socketUserMap = io.socketUserMap;

  next();
});

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/status", statusRoute);

const PORT = process.env.PORT || 8000;

// Listen from server instead of app
server.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
  connectMongoDB();
});
