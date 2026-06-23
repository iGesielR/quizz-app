require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/quizzes", quizRoutes);

app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado");
});