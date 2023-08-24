const mongoose = require('mongoose');

const colors = require('colors');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    // await mongoose.connect(process.env.LOCAL_DATABASE)
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb server issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
