import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import DisplayAdvertisingHeader from './DisplayAdvertisingHeader';

const Header = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className='bg-gradient' >
        <div className='container-fluid'>
          <Navbar.Brand href="/" className='text-warning'>UtilitRedes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/"><i className="bi bi-house-fill"></i> Home</Nav.Link>
              <Nav.Link href="busca-cep"><i className="bi bi-envelope-fill"></i> Busca CEP</Nav.Link>
              <Nav.Link href="calc-orcamento-rapido"><i className="bi bi-calculator-fill"></i> Calc. Orçamento Rápido</Nav.Link>
              <Nav.Link href="conversa-por-whatsapp"><i className="bi bi-whatsapp"></i> Conversa por WhatsApp</Nav.Link>
              <Nav.Link href="teste">Teste</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <DisplayAdvertisingHeader />
    </>
  );
};

export default Header;
