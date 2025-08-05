const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectMongoDB = require("./src/configs/database.config");

const authRoute = require("./src/routes/auth.route");
const chatRoute = require("./src/routes/chat.route");

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
  connectMongoDB();
});
