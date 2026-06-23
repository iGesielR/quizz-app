const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "El título y las preguntas son obligatorios" });
    }

    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el quiz en el servidor", error });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los quizzes", error });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz no encontrado" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el quiz por ID", error });
  }
};

// --- NUEVA FUNCIÓN PARA ELIMINAR ---
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz no encontrado para eliminar" });
    }

    res.json({ message: "Quiz eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el quiz", error });
  }
};