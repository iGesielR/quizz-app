import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 1.5rem 3rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
`;

export default function Navbar() {
  return (
    <Nav>
      <Link to="/" style={{textDecoration: 'none', color: '#1a1f36', fontWeight: 'bold'}}>QuizLy</Link>
      <Link to="/" style={{textDecoration: 'none', color: '#64748b'}}>Volver al Home</Link>
    </Nav>
  );
}