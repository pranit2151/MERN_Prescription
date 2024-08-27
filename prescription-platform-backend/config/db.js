const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
  try {
    console.log("Connecting DB>>>") // Your log statement
    const conn = await mongoose.connect(process.env.MONGO_URI); // Connect without deprecated options

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
