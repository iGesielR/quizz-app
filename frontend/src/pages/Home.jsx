import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { FiPlusCircle, FiBookOpen } from 'react-icons/fi';

import bg1 from '../assets/bg1.png';

// --- ANIMACIONES ---
const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

// --- ESTILOS ---
const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow: hidden; /* Evita scroll por el fondo */
`;

/* Carrusel de Fondo */
const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  background-color: #f8fafc;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  /* CAMBIO: Subimos la opacidad a 1 (100%) cuando está activa */
  opacity: ${props => (props.active ? 1 : 0)}; 
  transition: opacity 2s ease-in-out, transform 10s linear;
  transform: ${props => (props.active ? 'scale(1.05)' : 'scale(1)')};
`;

/* Capa superpuesta para asegurar legibilidad */
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 250, 252, 0.6); 
  z-index: -1;
`;

const Navbar = styled.nav`
  position: relative;
  z-index: 10;
  padding: 1.5rem 3rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px); /* Efecto cristal en el nav */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  font-weight: 700;
  color: #1a1f36;
`;

const MainContent = styled.main`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #1a1f36;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #475569;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2rem; /* Mantiene la altura fija para que no salte el layout */
`;

const RotatingWord = styled.span`
  color: #3b82f6;
  font-weight: 700;
  display: inline-block;
  animation: ${fadeInOut} 3s linear infinite; /* 3s debe coincidir con el intervalo de React */
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  gap: 2rem;
  @media (max-width: 650px) { grid-template-columns: 1fr; }
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  text-decoration: none;
  color: #475569;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s, border 0.2s;
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px rgba(0,0,0,0.1);
    border: 1px solid #bfdbfe; /* Borde azul claro al hacer hover */
    color: #3b82f6;
  }
`;

const Footer = styled.footer`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.9rem;
`;

// --- DATOS MOCK ---
const bgImages = [
  'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Un foco iluminado 
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Laptop y libretas
  bg1
];

const words = ['Lógica', 'Cultura General', 'Tecnología', 'Ciencias', 'Historia'];

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [currentImg, setCurrentImg] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);

  // Hook para el carrusel de fondo (cambia cada 6 segundos)
  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(imgInterval);
  }, []);

  
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <PageWrapper>
      {/* Carrusel y Capa de Opacidad */}
      <BackgroundContainer>
        {bgImages.map((src, index) => (
          <BackgroundImage 
            key={index} 
            src={src} 
            active={index === currentImg} 
          />
        ))}
      </BackgroundContainer>
      <Overlay />

      {/* Contenido Frontal */}
      <Navbar>
        <span>QuizLy</span>
        <div style={{fontSize: '0.9rem', color: '#64748b'}}>Dashboard</div>
      </Navbar>

      <MainContent>
        <Title>¿Qué deseas hacer hoy?</Title>
        <Subtitle>
          Desafía tu mente creando y resolviendo trivias de
          {/* Key=currentWord fuerza a React a re-renderizar la etiqueta para reiniciar la animación CSS */}
          <RotatingWord key={currentWord}>
            {words[currentWord]}
          </RotatingWord>
        </Subtitle>
        
        <ActionsContainer>
          <ActionCard to="/create">
            <FiPlusCircle size={40} style={{marginBottom: '1rem'}} />
            Crear Nuevo Quiz
          </ActionCard>
          <ActionCard to="/quizzes">
            <FiBookOpen size={40} style={{marginBottom: '1rem'}} />
            Resolver Quizzes
          </ActionCard>
        </ActionsContainer>
      </MainContent>

      <Footer>
        Quizly © 2026 | Desarrollado con dedicación
      </Footer>
    </PageWrapper>
  );
}