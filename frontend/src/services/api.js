import axios from "axios";

export default axios.create({
  // Intenta leer la variable de internet, si no existe (como en tu PC local), usa localhost
  baseURL: import.meta.env.VITE_API_URL || "https://quiz-app-backend-enj1.onrender.com/api"
});