import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';

const BuscaCep = () => {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]); 
  const [inputEstado, setInputEstado] = useState('');
  const [inputMunicipio, setInputMunicipio] = useState('');
  const [inputLogradouro, setInputLogradouro] = useState('');
  const [listaCeps, setListaCeps] = useState([{ inicial: null }]);
  const [modalConfig, setModalConfig] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);


  // Função para lidar com erros e mostrar o modal
  const handleError = () => {   
    setModalConfig({
      type: '',
      dialogClass: '',
      headerClass: 'bg-danger text-white',
      title: 'Erro na Requisição',
      bodyContent: (
        <div className="alert alert-danger" role="alert">
          <p>Problemas de conexão com sistema de dados. Volte depois...</p>
        </div>
      ),
      footerClass: 'bg-danger-subtle',
      onSave: () => {},
      btnCloseTxt: 'Fechar',
      btnCloseClass: 'danger',
      btnSaveTxt: '',
      btnSaveClass: '',
    });
    setShowModal(true); // Mostra o modal
  };


  useEffect(() => {
    // Fazendo a requisição para o IBGE
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
      .then(response => response.json()) // Converte a resposta para JSON
      .then(data => {
        const estadosOrdenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setEstados(estadosOrdenados); // Atualiza o estado com os dados ordenados
      })
      .catch(error => console.error('Erro ao buscar os estados:',
        handleError()
        , error));// Exibe o erro no console caso ocorra
      
  }, []); // O array vazio [] significa que o useEffect será executado apenas uma vez, quando o componente montar.

  useEffect(() => {
    if (inputEstado) { // Verifica se um estado foi selecionado      
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${inputEstado}/municipios?orderBy=nome`)
        .then(response => response.json())
        .then(data => {
          const municipiosOrdenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
          setMunicipios(municipiosOrdenados);
          console.log(municipiosOrdenados)
          setInputMunicipio(municipiosOrdenados[0]?.nome || ''); // Seleciona o primeiro município por padrão
        })
        .catch(error => console.error('Erro ao buscar os municípios:',
          handleError()
          , error));
    }
  }, [inputEstado]); // Adiciona `inputEstado` como dependência

  const handlerOnchangeInputestado = (e) => {
    setInputEstado(e.target.value);
    setInputMunicipio(''); // Reseta o município ao mudar o estado 
    setListaCeps([{ inicial: null }])
    setInputLogradouro('');
  };

  const handlerOnchangeInputmunicipio = (e) => {
    const valorMunicipio = e.target.value;
    setInputMunicipio(valorMunicipio);    
    setListaCeps([{ inicial: null }])
    setInputLogradouro('');
  };

  const handleronchangerInputLogradouro = (e) => {
    const valorLogradouro = e.target.value;
    setInputLogradouro(valorLogradouro);

    if (valorLogradouro.length >= 3) {

      const estado = inputEstado;
      const municipio = inputMunicipio.replace(/[’']/g, '');//remove apostrofo do nome do município
      const logradouro = valorLogradouro;

      if(!estado || !municipio){
        setModalConfig({
          type: '',
          dialogClass: '',
          headerClass: 'bg-danger text-white',
          title: 'Alerta....',
          bodyContent: (
            <div className="alert alert-danger" role="alert">
              <p>Você precisa antes selecionar estado e municipio.</p>
            </div>
          ),
          footerClass: 'bg-danger-subtle',
          onSave: () => {},
          btnCloseTxt: 'Fechar',
          btnCloseClass: 'danger',
          btnSaveTxt: '',
          btnSaveClass: '',
        });
        setShowModal(true); // Mostra o modal
        return
      }

      fetch(`https://viacep.com.br/ws/${estado}/${municipio}/${logradouro}/json/`)
        .then(response => response.json())
        .then(data => {
          // Ordena os dados primeiro pelo campo 'logradouro' e depois pelo 'cep'
          const sortedData = data.sort((a, b) => {
            // Comparação por 'logradouro'
            if (a.logradouro < b.logradouro) return -1;
            if (a.logradouro > b.logradouro) return 1;
            // Se 'logradouro' for igual, ordena por 'cep'
            if (a.cep < b.cep) return -1;
            if (a.cep > b.cep) return 1;
            return 0;
          });

          setListaCeps(sortedData);
        })
        .catch(error => console.error('Erro ao fazer a requisição: ',
          handleError(),
           error));
    } else {
      setListaCeps([{ inicial: null }])     
    }    
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value)
  }
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
          <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-primary rounded shadow-sm">
            <div className="lh-100">
              <h3 className="mb-0 text-white lh-100"> <i className="bi bi-envelope"></i> Busca CEP</h3>
            </div>
          </div>
          <div className='alert alert-primary' role="alert">
             <div className='container'>
              <div className='row'>
                <div className="col-md-4 col-sm-4 col-12">
                  <label htmlFor="inputEstado" className="col-form-label fw-semibold">Estado</label>
                  <select id="inputEstado" className="form-select" value={inputEstado} onChange={handlerOnchangeInputestado}>
                    <option value="">Selecione um estado</option>
                    {estados.map(estado => (
                      <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 col-sm-4 col-12">
                  <label htmlFor="inputMunicipio" className="col-form-label fw-semibold">Município</label>
                  <select id="inputMunicipio" className="form-select" value={inputMunicipio} onChange={handlerOnchangeInputmunicipio}>
                    <option value="">Selecione um município</option>
                    {municipios.map(municipio => (
                      <option key={municipio.id} value={municipio.nome}>{municipio.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 col-sm-4 col-12">
                  <label htmlFor="inputLogradouro" className="col-form-label fw-semibold">Logradouro</label>
                  <input id="inputLogradouro" className="form-control" type="text" autoComplete="off" defaultValue={inputLogradouro} onChange={handleronchangerInputLogradouro} placeholder='Rua, avenida, estrada, praça, travessa'></input>
                </div>
              </div>
            </div>
          </div>

          <div className='container-fluid text-center' >

            {listaCeps.length === 1 && listaCeps[0].inicial === null ? (
              null
            ) : listaCeps.length === 1 && listaCeps[0].bairro === '' && listaCeps[0].logradouro === '' ? (
              listaCeps.map(listaCep => (
                <div key={listaCep.cep} className='p-3 bg-secondary-subtle rounded row'>                  
                  <div className='col-md-1 col-sm-2 col-12'>
                   
                    <div className='row'>
                      <div className='text-secondary'>CEP</div>
                      <div className='d-flex align-items-center bg-danger-subtle px-0' style={{ height: '40px' }} >
                        <input className='btn btn-danger form-control' defaultValue={listaCep.cep} onClick={() => handleCopy(listaCep.cep)} title="Clique e copie o CEP"></input>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-11 col-sm-10 col-12'>
                    <div className='row'>
                      <div className='text-secondary'>Informação</div>
                      <div className='d-flex justify-content-center align-items-center bg-danger-subtle text-danger-emphasis px-0' style={{ minHeight: '40px' }} >
                        Atenção: O Município de <strong>&nbsp;{listaCep.localidade} / {listaCep.uf}&nbsp;</strong> pode possuir apenas um código postal geral.
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : listaCeps.length === 0 ? (
              <div className='p-3 bg-secondary-subtle rounded row text-center'>
                <div className=''>
                  <div className='row'>
                    <div className='text-secondary'>Informação</div>
                    <div className='d-flex justify-content-center align-items-center bg-danger-subtle text-danger-emphasis px-0' style={{ minheight: '40px' }} >
                      Verifique a digitação; nenhum resultado foi encontrado na base de dados.
                    </div>
                  </div>
                </div>
              </div>
            ) : (listaCeps.map(listaCep => (
              <div key={listaCep.cep} className=' d-flex justify-content-center align-items-center p-2 mb-3 bg-secondary-subtle border border-secondary-subtle rounded row'>
                
                <div className='col-md-1 col-sm-2 col-3'>
                  <div className='row'>
                    <div className='text-secondary'>CEP</div>
                    <div className='d-flex align-items-center bg-white px-0' style={{ height: '40px' }} >
                      <input className='btn btn-primary form-control' defaultValue={listaCep.cep} onClick={() => handleCopy(listaCep.cep)} title="Clique e copie o CEP"></input>
                    </div>
                  </div>
                </div>
                <div className='col-md-3 col-sm-3 col-9'>
                  <div className='row'>
                    <div className='text-secondary'>Logradouro</div>
                    <div className='d-flex justify-content-center align-items-center bg-white' style={{ height: '40px' }}>{listaCep.logradouro}</div>
                  </div>
                </div>
                <div className='col-md-3 col-sm-2 col-12'>
                  <div className='row'>
                    <div className='text-secondary'>Complemento</div>
                    <div className='d-flex justify-content-center align-items-center bg-white' style={{ height: '40px' }}>{listaCep.complemento}</div>
                  </div>
                </div>
                <div className='col-md-3 col-sm-3 col-6'>
                  <div className='row'>
                    <div className='text-secondary'>Bairro</div>
                    <div className='d-flex justify-content-center align-items-center bg-white' style={{ height: '40px' }}>{listaCep.bairro}</div>
                  </div>
                </div>
                <div className='col-md-2 col-sm-2 col-6'>
                  <div className='row'>
                    <div className='text-secondary'>Município</div>
                    <div className='d-flex justify-content-center align-items-center bg-white text-wrap' style={{ height: '40px' }}>{listaCep.localidade} / {listaCep.uf}</div>
                  </div>
                </div>
              </div>
            )))}
          </div>

        </div>
      </div>
    </>
  );
}

export default BuscaCep;