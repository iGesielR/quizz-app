const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true // Evita preguntas sin texto
  },
  options: {
    type: [String],
    required: true // Evita preguntas sin opciones
  },
  correctAnswer: {
    type: String,
    required: true // Evita preguntas sin respuesta definida
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [QuestionSchema]
});

module.exports = mongoose.model("Quiz", QuizSchema);