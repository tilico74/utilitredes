import React, { useState } from 'react';
import CustomModal from '../components/CustomModal';
import listaPaises from '../jsons/countriesJson_ptBR.json';


// Ordena o array de objetos pelo nome do país
const listaPaisesOrdenada = listaPaises.sort((a, b) => a.nome.localeCompare(b.nome));

// Função de máscara de telefone
const maskPhone = (value, inputPais) => {
  // Verifica se o código do país é 0055
  if (inputPais !== '0055') {
    return value; // Se não for 0055, retorna o valor sem máscara
  }

  // Remove tudo o que não é dígito
  value = value.replace(/\D/g, '');

  // Limita o número de dígitos a 11
  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  // Verifica se o campo está vazio
  if (value.length === 0) {
    return '';
  }

  // Aplica a máscara
  if (value.length > 10) {
    // Máscara para (00) 00000-0000
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length > 6) {
    // Máscara para (00) 0000-0000
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    // Máscara inicial (00) 0000
    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
  } else {
    // Retorna apenas os números digitados, sem parênteses
    value = value.replace(/(\d{0,2})/, '$1');
  }

  return value;
};

// Função de validação de número de telefone brasileiro
const isValidPhoneNumber = (number) => {
  const phonePattern = /^[1-9]{2}9\d{8}$/;
  return phonePattern.test(number);
};


const ConversaPorWhatsapp = () => {
  const [inputPais, setInputPais] = useState('0055');
  const [inputPhone, setInputPhone] = useState('');
  const [modalConfig, setModalConfig] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setInputPhone(maskPhone(value, inputPais));
  };

  const handleCountryChange = (event) => {
    setInputPais(event.target.value);
    setInputPhone('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const countryCode = inputPais.replace(/^0+/, '');//Remove os caracteres 0 do codigo do país
    const phoneNumber = inputPhone.replace(/\D/g, ''); // Remove caracteres não numéricos
    const greeting = 'Olá! Podemos conversar?';
    const whatsappLink = `https://wa.me/+${countryCode}${phoneNumber}?text=${encodeURIComponent(greeting)}`;

    if (inputPais === '0055') {

      // Verifica se o número é válido
      if (!isValidPhoneNumber(phoneNumber)) {
        setInputPhone('')

        setModalConfig({
          type: '',
          dialogClass: '',
          headerClass: 'bg-danger text-white',
          title: 'Alerta.....',
          bodyContent: (<div className="alert alert-danger" role="alert">
            <p>O número de telefone inserido não é válido para o Brasil. Corrija isso...</p>
          </div>),
          footerClass: 'bg-danger-subtle',
          onSave: () => {
            return;
          },
          btnCloseTxt: 'Fechar',
          btnCloseClass: 'danger',
          btnSaveTxt: '',
          btnSaveClass: '',
        });
        setShowModal(true);

        return;
      }

      // Abre o link em uma nova aba
      window.open(whatsappLink, '_blank');
    } else {
      window.open(whatsappLink, '_blank');
    }

    // Limpa o campo de telefone após o envio
    setInputPhone('');
  };


  return (
    <>
      <div>
        <CustomModal
          show={showModal}
          handleClose={handleClose}
          {...modalConfig}  // Spread operator para passar as configurações
        />
      </div>

      <div>
        <div className='container-fluid'>
          <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-success rounded shadow-sm">
            <div className="lh-100">
              <h3 className="mb-0 text-white lh-100"><i className="bi bi-whatsapp"></i> Conversa por WhatsApp</h3>
            </div>
          </div>
          <div className='alert alert-success' role="alert">
            <div className='container'>
              <form onSubmit={handleSubmit}>
                <div className='row'>
                  <div className='col-md-4 col-sm-5'>
                    <label htmlFor="" className="form-label fw-semibold">Escolha o país</label>
                    <select className="form-select" id='inputPais' defaultValue={inputPais} onChange={handleCountryChange}>
                      <option value='0055'>Brasil - BRA</option>
                      {listaPaisesOrdenada.map(({ codigo, fone, nome, iso3 }) => (
                        <option key={codigo} value={fone}>
                          {nome} - {iso3}
                        </option>))}
                    </select>
                  </div>
                  <div className="col-md-3 col-sm-5">
                    <label htmlFor="" className="form-label fw-semibold">Digite o telefone</label>
                    <input type="text" className="form-control" id="inputPhone" value={inputPhone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" aria-describedby="" />
                  </div>
                  <div className='col-md-2 col-sm-2'>
                    <label htmlFor="" className="form-label">&nbsp;</label>
                    <button className="btn btn-success form-control" type='submit'>Iniciar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <p className='text-center'>Esta aplicação permite iniciar uma conversa no WhatsApp de forma instantânea, sem a necessidade de adicionar o número do destinatário aos seus contatos.</p>
        </div>
      </div>
    </>
  );
};
export default ConversaPorWhatsapp;