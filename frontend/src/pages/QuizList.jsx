import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiTrash2, FiPlay, FiBookOpen } from "react-icons/fi";
import Navbar from "../components/Navbar";

// --- ANIMACIONES ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- ESTILOS (Modern Mesh & Glassmorphism) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  
  /* Fondo creativo: Mesh Gradient suave */
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 10% 10%, #e0e7ff 0px, transparent 50%),
    radial-gradient(at 90% 10%, #fef3c7 0px, transparent 50%),
    radial-gradient(at 90% 90%, #f3e8ff 0px, transparent 50%),
    radial-gradient(at 10% 90%, #dcfce7 0px, transparent 50%);
`;

const Content = styled.div`
  flex: 1;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  color: #0f172a;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
`;

const QuizCard = styled.div`
  /* Efecto Glassmorphism */
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 2.5rem 2rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  text-align: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Animación en cascada usando el índice */
  animation: ${fadeInUp} 0.6s ease-out backwards;
  animation-delay: ${props => props.$delay}s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.95);
  }

  h3 {
    margin: 1.5rem 0;
    color: #1e293b;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.4;
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  color: #3b82f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.6rem;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.1);
`;

const SubtleDelete = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ffffff;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &:hover {
    background: #fee2e2;
    color: #ef4444;
    transform: scale(1.1);
  }
`;

const SolveLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  
  h3 {
    color: #334155;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const BackLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.6);

  &:hover {
    color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
`;

// --- COMPONENTE ---
export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error("Error al obtener quizzes:", err));
  }, []);

  const handleDelete = async (id) => {
    const password = prompt("Introduce la contraseña de administrador para eliminar:");
    
    if (password === "020600") { 
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
      } catch (err) {
        alert("Error al intentar eliminar el quiz.");
      }
    } else if (password !== null) {
      alert("Contraseña incorrecta.");
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      
      <Content>
        <HeaderSection>
          <Title>Explora los Quizzes</Title>
          <Subtitle>Pon a prueba tus conocimientos eligiendo un desafío a continuación.</Subtitle>
        </HeaderSection>
        
        <QuizGrid>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <QuizCard key={quiz._id} $delay={index * 0.1}>
                <SubtleDelete onClick={() => handleDelete(quiz._id)} title="Eliminar Quiz">
                  <FiTrash2 size={16} />
                </SubtleDelete>

                <IconWrapper>
                  <FiBookOpen />
                </IconWrapper>

                <h3>{quiz.title}</h3>
                
                <SolveLink to={`/quiz/${quiz._id}`}>
                  <FiPlay /> Resolver Quiz
                </SolveLink>
              </QuizCard>
            ))
          ) : (
            <EmptyState>
              <h3>Aún no hay quizzes disponibles</h3>
              <p>Anímate a crear el primer cuestionario y desafía a los demás.</p>
            </EmptyState>
          )}
        </QuizGrid>

        <BackLink to="/">
          ← Volver al Inicio
        </BackLink>
      </Content>

      <Footer>Quiz App © 2026 | Desarrollado con dedicación</Footer>
    </PageWrapper>
  );
}