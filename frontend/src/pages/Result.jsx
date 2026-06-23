import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// --- ANIMACIONES ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleUp = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

// --- ESTILOS (Soft Minimalist Theme) ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const ResultCard = styled.div`
  background: #ffffff;
  padding: 3.5rem 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 650px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid #f1f5f9;
`;

const Title = styled.h2`
  color: #0f172a;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
`;

// --- GRÁFICO CIRCULAR CSS ---
const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  animation: ${scaleUp} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
`;

const CircleProgress = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  /* El conic-gradient crea el efecto de dona llenándose según el porcentaje */
  background: conic-gradient(
    ${props => props.$color} ${props => props.$percentage}%, 
    #e2e8f0 0
  );
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  /* El centro blanco de la dona */
  &::before {
    content: "";
    position: absolute;
    width: 130px;
    height: 130px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
  }
`;

const CircleText = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span.percent {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e293b;
    line-height: 1;
  }
  
  span.label {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 600;
    margin-top: 0.2rem;
  }
`;

// --- TARJETAS DE MÉTRICAS ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 3rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: ${props => props.$bg || "#f8fafc"};
  border: 1px solid ${props => props.$borderColor || "#e2e8f0"};
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const StatValue = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.$color || "#1e293b"};
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
`;

// --- BOTONES ---
const ActionFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 1.1rem 2rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;

  ${props => props.$primary ? `
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    &:hover { background-color: #2563eb; transform: translateY(-2px); }
  ` : `
    background-color: #f1f5f9;
    color: #475569;
    &:hover { background-color: #e2e8f0; transform: translateY(-2px); }
  `}
`;

// --- COMPONENTE PRINCIPAL ---
export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers } = location.state || {};

  // Redirección de seguridad si acceden a /result directamente sin jugar
  if (!quiz || !answers) {
    return (
      <Container>
        <ResultCard>
          <Title>Oops...</Title>
          <Subtitle>Parece que no hay resultados disponibles.</Subtitle>
          <Button $primary onClick={() => navigate("/")}>Ir al Inicio</Button>
        </ResultCard>
      </Container>
    );
  }

  // --- CÁLCULOS ---
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((acc, q, i) => 
    answers[i] === q.correctAnswer ? acc + 1 : acc, 0);
  const incorrect = quiz.questions.reduce((acc, q, i) => 
    (answers[i] && answers[i] !== q.correctAnswer) ? acc + 1 : acc, 0);
  const omitted = total - (correct + incorrect);
  const percentage = Math.round((correct / total) * 100);

  // --- LÓGICA DE MENSAJES Y COLORES ---
  let feedbackMessage = "";
  let progressColor = "#3b82f6"; // Azul por defecto

  if (percentage >= 90) {
    feedbackMessage = "¡Impresionante! Tienes un dominio total.";
    progressColor = "#10b981"; // Verde esmeralda
  } else if (percentage >= 60) {
    feedbackMessage = "¡Buen trabajo! Vas por muy buen camino.";
    progressColor = "#3b82f6"; // Azul
  } else {
    feedbackMessage = "Sigue practicando, cada error es un aprendizaje.";
    progressColor = "#f59e0b"; // Naranja
  }

  return (
    <Container>
      <ResultCard>
        <Title>Resultados del Quiz</Title>
        <Subtitle>{feedbackMessage}</Subtitle>
        
        {/* Gráfico Circular de Progreso */}
        <CircleWrapper>
          <CircleProgress $percentage={percentage} $color={progressColor}>
            <CircleText>
              <span className="percent">{percentage}%</span>
              <span className="label">Exactitud</span>
            </CircleText>
          </CircleProgress>
        </CircleWrapper>

        {/* Tarjetas de Estadísticas Detalladas */}
        <StatsGrid>
          <StatBox $bg="#ecfdf5" $borderColor="#d1fae5">
            <StatValue $color="#059669">{correct}</StatValue>
            <StatLabel>Correctas</StatLabel>
          </StatBox>
          
          <StatBox $bg="#fef2f2" $borderColor="#fee2e2">
            <StatValue $color="#dc2626">{incorrect}</StatValue>
            <StatLabel>Incorrectas</StatLabel>
          </StatBox>

          <StatBox $bg="#f8fafc" $borderColor="#e2e8f0">
            <StatValue $color="#64748b">{omitted}</StatValue>
            <StatLabel>Omitidas</StatLabel>
          </StatBox>
        </StatsGrid>

        <ActionFooter>
          <Button onClick={() => navigate("/quizzes")}>Intentar Otro</Button>
          <Button $primary onClick={() => navigate("/")}>Volver al Inicio</Button>
        </ActionFooter>
      </ResultCard>
    </Container>
  );
}