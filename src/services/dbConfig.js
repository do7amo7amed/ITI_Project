//src/services/dbConfig.js
const mongoose = require("mongoose");

//fire & forget
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB; //to be able to use in server.js
