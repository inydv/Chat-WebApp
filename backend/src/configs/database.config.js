const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected on ", connection);
  } catch (error) {
    console.error("MongoDB error: ", error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
