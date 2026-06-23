import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Quitamos useBlocker
import api from "../services/api";
import styled, { keyframes } from "styled-components";

// --- ANIMACIONES ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// --- ESTILOS ---
const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #1e293b;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const QuizContainer = styled.div`
  width: 100%;
  max-width: 650px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const QuizCard = styled.div`
  background: #ffffff;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
`;

const HeaderArea = styled.div`
  margin-bottom: 2rem;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  width: ${props => props.$progress}%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
`;

const QuestionText = styled.h2`
  color: #0f172a;
  margin-bottom: 2.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 1.2rem 1.5rem;
  text-align: left;
  background: ${props => props.$selected ? "#eff6ff" : "#f8fafc"};
  border: 2px solid ${props => props.$selected ? "#3b82f6" : "#e2e8f0"};
  border-radius: 16px;
  color: ${props => props.$selected ? "#1d4ed8" : "#475569"};
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.$selected ? "#3b82f6" : "#cbd5e1"};
    background: ${props => props.$selected ? "#eff6ff" : "#f1f5f9"};
    transform: translateY(-2px);
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #f1f5f9;
`;

const ActionButton = styled.button`
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  border: none;
  background: ${props => props.$primary ? "#3b82f6" : "#f1f5f9"};
  color: ${props => props.$primary ? "#ffffff" : "#64748b"};
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover:not(:disabled) { 
    background: ${props => props.$primary ? "#2563eb" : "#e2e8f0"}; 
    transform: translateY(-2px);
  }

  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
    transform: none;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  height: fit-content;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 650px;
  }
`;

const SidebarTitle = styled.h4`
  text-align: center;
  color: #334155;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const CircleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 12px;
  justify-items: center;
  margin-bottom: 1.5rem;
`;

const Circle = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid ${props => props.$active ? "#3b82f6" : "transparent"};
  cursor: pointer;
  background: ${props => 
    props.$active ? "#ffffff" : 
    props.$answered ? "#10b981" : "#f1f5f9"};
  color: ${props => 
    props.$active ? "#3b82f6" : 
    props.$answered ? "#ffffff" : "#64748b"};
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$answered ? "0 4px 10px rgba(16, 185, 129, 0.2)" : "none"};

  &:hover {
    transform: scale(1.1);
  }
`;

// --- ESTILOS DEL MODAL DE ADVERTENCIA ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
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
  max-width: 420px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  animation: ${slideUp} 0.3s ease-out;

  h3 { margin-top: 0; color: #0f172a; font-size: 1.4rem; margin-bottom: 1rem; font-weight: 700; }
  p { color: #64748b; margin-bottom: 2rem; line-height: 1.5; font-size: 0.95rem; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

// --- COMPONENTE PRINCIPAL ---
export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // Estado manual para el modal de salida

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then((res) => setQuiz(res.data))
      .catch(err => console.error("Error cargando:", err));
  }, [id]);

  // Alerta nativa si refrescan (F5) o cierran la pestaña
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0 && !isSubmitted) {
        e.preventDefault();
        e.returnValue = "Si sales de la página, perderás tu progreso."; 
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, isSubmitted]);

  if (!quiz || !quiz.questions) {
    return (
      <Layout style={{ alignItems: 'center' }}>
        <h2 style={{ color: '#64748b' }}>Cargando desafío...</h2>
      </Layout>
    );
  }

  const q = quiz.questions[current];
  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const finishQuiz = () => {
    setIsSubmitted(true);
    navigate("/result", { state: { quiz, answers } });
  };

  // Manejo del botón Salir voluntario
  const handleExitClick = () => {
    if (Object.keys(answers).length > 0) {
      setShowExitModal(true); // Muestra el modal si hay progreso
    } else {
      navigate("/"); // Va directo si no ha respondido nada
    }
  };

  return (
    <Layout>
      <QuizContainer>
        <HeaderArea>
          <ProgressInfo>
            <span>Progreso del Quiz</span>
            <span>{answeredQuestions} de {totalQuestions} respondidas</span>
          </ProgressInfo>
          <ProgressBarBackground>
            <ProgressBarFill $progress={progressPercentage} />
          </ProgressBarBackground>
        </HeaderArea>

        <QuizCard>
          <QuestionText>{q.question}</QuestionText>
          
          <OptionsContainer>
            {q.options && q.options.map((opt, index) => (
              <OptionButton 
                key={index}
                $selected={answers[current] === opt}
                onClick={() => setAnswers({...answers, [current]: opt})}
              >
                {opt}
              </OptionButton>
            ))}
          </OptionsContainer>

          <NavButtons>
            <ActionButton 
              onClick={() => setCurrent(c => c - 1)} 
              disabled={current === 0}
            >
              Anterior
            </ActionButton>
            
            {current === totalQuestions - 1 ? (
              <ActionButton $primary onClick={finishQuiz}>
                Terminar y Enviar
              </ActionButton>
            ) : (
              <ActionButton $primary onClick={() => setCurrent(c => c + 1)}>
                Siguiente
              </ActionButton>
            )}
          </NavButtons>
        </QuizCard>
      </QuizContainer>

      <Sidebar>
        <SidebarTitle>Navegación</SidebarTitle>
        <CircleGrid>
          {quiz.questions.map((_, i) => (
            <Circle 
              key={i} 
              $active={current === i} 
              $answered={answers[i] !== undefined}
              onClick={() => setCurrent(i)}
              title={`Pregunta ${i + 1}`}
            >
              {i + 1}
            </Circle>
          ))}
        </CircleGrid>

        {/* Botón Salir elegante dentro del Sidebar */}
        <ActionButton 
          style={{ width: '100%', backgroundColor: '#fee2e2', color: '#ef4444' }}
          onClick={handleExitClick}
        >
          Abandonar Quiz
        </ActionButton>
      </Sidebar>

      {/* --- MODAL CONTROLADO POR ESTADO LOCAL --- */}
      {showExitModal && (
        <ModalOverlay onClick={() => setShowExitModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>¿Abandonar cuestionario?</h3>
            <p>Tienes respuestas registradas. Si decides salir ahora, perderás todo el progreso acumulado en este intento de forma definitiva.</p>
            <ModalActions>
              <ActionButton onClick={() => setShowExitModal(false)}>
                Permanecer aquí
              </ActionButton>
              <ActionButton 
                style={{ backgroundColor: '#ef4444', color: 'white' }} 
                onClick={() => {
                  setIsSubmitted(true);
                  navigate("/");
                }}
              >
                Sí, salir
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
}