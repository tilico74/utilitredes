import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CalcOrcamentoRapido from './pages/CalcOrcamentoRapido';
import Teste from './pages/Teste1';
import ConversaPorWhatsapp from './pages/ConversaPorWhatsapp';
import BuscaCep from './pages/BuscaCep';
import Home from './pages/Home'
import Footer from './components/Footer';


const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column custom-min-vh">
        <Header />
        <main className="flex-grow-1">
          <div className="">
            <Routes>
              {/* Todas essas rotas redirecionam para a rota Home */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/index" element={<Navigate to="/" />} />
              <Route path="index" element={<Navigate to="/" />} />

              <Route path="/calc-orcamento-rapido" element={<CalcOrcamentoRapido />} />
              <Route path="/conversa-por-whatsapp" element={<ConversaPorWhatsapp />} />
              <Route path="/busca-cep" element={<BuscaCep />} />
              <Route path="/teste" element={<Teste />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;