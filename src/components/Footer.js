import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear(); // Obtém o ano atual

  return (
    <footer className="bg-dark text-white py-4 text-center mt--auto">
      <div className="container-fluid">
        <p className="mb-0">&copy; 2024 - {currentYear} UtilitRedes. Todos os direitos reservados.</p>        
      </div>
    </footer>
  );
};

export default Footer;
