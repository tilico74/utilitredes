import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ type, show, handleClose, dialogClass, headerClass, title, bodyContent, footerClass, btnCloseTxt, btnCloseClass, btnSaveTxt, btnSaveClass, onSave }) => {
  const [inputComprimento, setInputComprimento] = useState('');
  const [inputAltura, setInputAltura] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [inputValor, setInputValor] = useState('');

  useEffect(() => {
    if (bodyContent) {
      setInputComprimento(bodyContent.comprimento || '');
      setInputAltura(bodyContent.altura || '');
      setInputDescricao(bodyContent.descricao || '');
      setInputValor(bodyContent.valor ? bodyContent.valor.replace('R$ ', '') : '');
    }
  }, [bodyContent]);

  const handleEdit = () => {
    const updatedContent = {
      comprimento: inputComprimento,
      altura: inputAltura,
      descricao: inputDescricao,
      valor: inputValor,
    };
    onSave(updatedContent); // Passa os dados atualizados para o onSave
    handleClose();
  };

  /* FUNÇÃO mascaraNumero FUNCIONANDO TESTADA NÃO MEXER */
  const mascaraNumero = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for dígito
    value = (value / 100).toFixed(2) + ""; // Divide por 100 e fixa 2 casas decimais
    value = value.replace(".", ","); // Substitui ponto por vírgula
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona os pontos de milhar
    return value;
  };

  // Verificação do ID (se necessário)
  const modalId = bodyContent?.id || 'default-id'; // Use 'default-id' ou qualquer valor padrão caso bodyContent ou id seja undefined.

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={dialogClass}>
      <Modal.Header className={headerClass} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === "edit" ? (
          // Conteúdo para a edição 
          <div className='form alert alert-primary' role="alert">
            <div className='container'>
              <div className='row'>
                <div className="col-md-4 mb-2">
                  <div className="input-group">
                    <input
                      id='inputModalComprimento'
                      placeholder='Comprimento'
                      className="form-control placeholder-primary input-text-right input-placeholder-center"
                      value={inputComprimento}
                      onChange={(e) => setInputComprimento(mascaraNumero(e.target.value))}
                    />
                    <span className="input-group-text bg-primary-subtle text-primary-emphasis">X</span>
                    <input
                      id='inputModalAltura'
                      placeholder='Altura'
                      className="form-control placeholder-primary input-text-right input-placeholder-center"
                      value={inputAltura}
                      onChange={(e) => setInputAltura(mascaraNumero(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <input
                    type="text"
                    id="inputModalDescricao"
                    className="form-control"
                    placeholder="Descrição"
                    value={inputDescricao}
                    onChange={(e) => setInputDescricao(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <div className="row">
                    <div className='col-md-8 col-6'>
                      <input
                        id='inputModalValor'
                        placeholder='Valor R$'
                        className="form-control placeholder-primary input-text-right input-placeholder-center"
                        value={inputValor}
                        onChange={(e) => setInputValor(mascaraNumero(e.target.value))}
                      />
                    </div>
                    <div className='col-md-4 col-6'>
                      <button type="button" className="btn btn-primary w-100" onClick={handleEdit}>Editar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : type === "delete" ? (
          // Conteúdo para a deleção
          <div className='alert alert-danger' role="alert">
            <p>Tem certeza de que deseja excluir este item? <span className="badge rounded-pill text-bg-danger fs-4"> {modalId}</span></p>
          </div>
        ) : (
          <div>{ bodyContent }</div>          
        )}
      </Modal.Body>
      <Modal.Footer className={footerClass}>
        <Button variant= {btnCloseClass} onClick={handleClose}>
          {btnCloseTxt}
        </Button>
        <Button variant={btnSaveClass} onClick={handleEdit}>
          {btnSaveTxt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
