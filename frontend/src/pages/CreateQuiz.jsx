import React, { useState } from "react";
import api from "../services/api";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// --- ANIMACIONES ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// --- ESTILOS (Styled Components) ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const FormCard = styled.div`
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 850px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #46566d;
  font-size: 1rem;
`;

const Input = styled.input`
  /* CORRECCIÓN DE OVERFLOW: border-box evita que el padding rompa el 100% del ancho */
  box-sizing: border-box; 
  width: 100%; 
  padding: 1.1rem;
  margin-bottom: 1rem;
  border: 2px solid #c0c5cc;
  border-radius: 12px;
  font-size: 1rem;
  color: #334155;
  background-color: #edf0ede1;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const MainTitleInput = styled(Input)`
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1.2rem;
  margin-bottom: 2rem;
  border-color: #cbd5e1;
`;

const QuestionBlock = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.1rem;
    color: #475569;
    font-weight: 700;
    margin: 0;
  }
`;

const DeleteQuestionBtn = styled.button`
  background: transparent;
  border: none;
  color: #ef4444; 
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fef2f2;
    color: #b91c1c;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  box-sizing: border-box; /* Aplicado también aquí por seguridad */
  width: 100%;
  padding: 1.1rem;
  margin-top: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background-color: #f8fafc;
  color: #334155;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
`;

const ActionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    gap: 1.5rem;
  }
`;

const ButtonGroupRight = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.variant === 'primary' && `
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    &:hover { background-color: #2563eb; transform: translateY(-2px); }
  `}

  ${(props) => props.variant === 'secondary' && `
    background-color: #f1f5f9;
    color: #475569;
    &:hover { background-color: #e2e8f0; }
  `}

  ${(props) => props.variant === 'danger' && `
    background-color: transparent;
    color: #ef4444;
    border: 2px solid #fee2e2;
    &:hover { background-color: #fef2f2; border-color: #ef4444; }
  `}
`;

// --- ESTILOS DEL MODAL ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: ${slideUp} 0.3s ease-out;

  h3 { margin-top: 0; color: #0f172a; font-size: 1.4rem; margin-bottom: 1rem; }
  p { color: #64748b; margin-bottom: 2rem; line-height: 1.5; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

// --- COMPONENTE PRINCIPAL ---
export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // NUEVO: Estado para saber qué pregunta se quiere eliminar (almacena el índice)
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);
  };

  // --- LÓGICA DE ELIMINACIÓN CON CONFIRMACIÓN ---
  const handleDeleteClick = (index) => {
    setQuestionToDelete(index); // Abre el modal con la pregunta específica
  };

  const confirmRemoveQuestion = () => {
    if (questionToDelete !== null) {
      const updated = questions.filter((_, index) => index !== questionToDelete);
      setQuestions(updated);
      setQuestionToDelete(null); // Cierra el modal
    }
  };

  const cancelRemoveQuestion = () => {
    setQuestionToDelete(null); // Cierra el modal sin hacer nada
  };
  // ----------------------------------------------

  const updateQuestionText = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    if (!title) return alert("Por favor ingresa un título del Quiz");

    const isAnyQuestionEmpty = questions.some(q => !q.questionText || !q.correctAnswer);
    if (isAnyQuestionEmpty) return alert("Por favor, asegúrate de que todas las preguntas tengan texto y una respuesta correcta seleccionada.");

    const quizData = {
      title,
      questions: questions.map(q => ({
        question: q.questionText, 
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    try {
      await api.post("/quizzes", quizData);
      alert("¡Quiz guardado con éxito!");
      navigate("/");
    } catch (error) {
      console.error("Detalle:", error.response?.data);
      alert("Error al guardar");
    }
  };

  const handleCancelClick = () => setShowCancelModal(true);
  const confirmCancel = () => navigate("/");
  const abortCancel = () => setShowCancelModal(false);

  return (
    <Container>
      <FormCard>
        <Header>
          <Title>Crear Nuevo Quiz</Title>
          <Subtitle>Diseña tus preguntas y configura las respuestas correctas</Subtitle>
        </Header>

        <MainTitleInput
          placeholder="Título del Quiz (Ej. Historia Mundial)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {questions.map((q, qIndex) => (
          <QuestionBlock key={qIndex}>
            <QuestionHeader>
              <h3>Pregunta {qIndex + 1}</h3>
              {questions.length > 1 && (
                <DeleteQuestionBtn type="button" onClick={() => handleDeleteClick(qIndex)}>
                  Eliminar
                </DeleteQuestionBtn>
              )}
            </QuestionHeader>
            
            <Input
              placeholder="Escribe la pregunta detalladamente..."
              value={q.questionText}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
            />

            <OptionsGrid>
              {q.options.map((opt, optIndex) => (
                <Input
                  key={optIndex}
                  style={{marginBottom: 0}} /* Ya no necesitamos el width inline */
                  placeholder={`Opción ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                />
              ))}
            </OptionsGrid>

            <Select
              value={q.correctAnswer}
              onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
            >
              <option value="" disabled>Selecciona la respuesta correcta...</option>
              {q.options.map((opt, idx) => (
                opt.trim() !== "" && (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                )
              ))}
            </Select>
          </QuestionBlock>
        ))}

        <ActionFooter>
          <Button type="button" variant="danger" onClick={handleCancelClick}>
            Cancelar
          </Button>
          
          <ButtonGroupRight>
            <Button type="button" variant="secondary" onClick={addQuestion}>
              + Añadir Pregunta
            </Button>
            <Button type="button" variant="primary" onClick={saveQuiz}>
              Guardar Quiz
            </Button>
          </ButtonGroupRight>
        </ActionFooter>
      </FormCard>

      {/* --- MODAL DE CONFIRMACIÓN: DESCARTAR TODO --- */}
      {showCancelModal && (
        <ModalOverlay onClick={abortCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>¿Estás seguro?</h3>
            <p>Se perderán todos los datos y preguntas que hayas configurado en este quiz. Esta acción no se puede deshacer.</p>
            <ModalActions>
              <Button type="button" variant="secondary" onClick={abortCancel}>Continuar editando</Button>
              <Button type="button" variant="danger" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={confirmCancel}>Sí, descartar</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* --- NUEVO: MODAL DE CONFIRMACIÓN: ELIMINAR PREGUNTA INDIVIDUAL --- */}
      {questionToDelete !== null && (
        <ModalOverlay onClick={cancelRemoveQuestion}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>¿Eliminar Pregunta?</h3>
            <p>Estás a punto de eliminar la pregunta {questionToDelete + 1}. Esta acción no se puede deshacer.</p>
            <ModalActions>
              <Button type="button" variant="secondary" onClick={cancelRemoveQuestion}>Cancelar</Button>
              <Button type="button" variant="danger" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={confirmRemoveQuestion}>Sí, eliminar</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
}