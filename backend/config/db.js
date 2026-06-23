const mongoose = require("mongoose");
const dns = require("dns");

// Forzamos a Node a usar los DNS de Google
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });

    console.log("MongoDB conectado");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;