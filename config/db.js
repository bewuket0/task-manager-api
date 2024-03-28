const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.DATABASE_LOCAL);
    const conn = await mongoose.connect(process.env.DATABASE_ONLINE);
    console.log(`Mongo database connected : ${conn.connection.host}`);
  } catch (error) {
    console.error("error : ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
