require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");

connectDB();

const app = express();

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
const allowedOrigins = [
  'http://localhost:5173', // Para que sigas haciendo pruebas en mi pc
  'https://quizz-app-igesielrs-projects.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acceso denegado por políticas de seguridad de CORS'));
    }
  }
}));
// --------------------------------------------

app.use(express.json());

app.use("/api/quizzes", quizRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});