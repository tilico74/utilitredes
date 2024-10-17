import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CalcOrcamentoRapido = () => {
  const [tableRows, setTableRows] = useState([]);
  const [inputComprimento, setInputComprimento] = useState('');
  const [inputAltura, setInputAltura] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [inputValor, setInputValor] = useState('');
  const [inputDesconto, setInputDesconto] = useState('');
  const [tipoDesconto, setTipoDesconto] = useState('$');
  const [totalArea, setTotalArea] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [displayFooter, setDisplayFooter] = useState('none');

  const handleClose = () => setShowModal(false);

  // Função para formatar valores no padrão brasileiro sem o símbolo de moeda
  const formatNumber = (value) => {
    const floatVal = parseFloat(value);
    return floatVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumberSquareMeters = (value) => {
    const floatVal = parseFloat(value);
    return floatVal.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  // Função para formatar o valor
  const formatValue = (value) => {
    return parseFloat(value.replace('.', '').replace(',', '.')) || 0;
  };

  /* FUNÇÃO mascaraNumero FUNCIONANDO TESTADA NÃO MEXER */
  const mascaraNumero = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for dígito
    value = (value / 100).toFixed(2) + ""; // Divide por 100 e fixa 2 casas decimais
    value = value.replace(".", ","); // Substitui ponto por vírgula
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona os pontos de milhar
    return value;
  };

  /*FUNÇÃO handleSubmit TESTADE E APROVADA NÃO MEXER*/
  const handleSubmit = () => {

    // Função para verificar se o valor é zero ou está vazio
    const isZeroOrEmpty = (value) => {
      // Remove todos os caracteres não numéricos, exceto a vírgula
      const numericValue = value.replace(/[^0-9,]/g, '');

      // Verifica se o valor é '0' ou '0,00'
      return numericValue === '0' || numericValue === '0,00' || numericValue === '';
    };

    // Validação: Verifica se os campos não estão vazios, nulos ou com valor '0,00'
    if (isZeroOrEmpty(inputComprimento) || isZeroOrEmpty(inputAltura) || isZeroOrEmpty(inputValor)) {
      setModalConfig({
        type: '',
        dialogClass: '',
        headerClass: 'bg-danger text-white',
        title: 'Alerta.....',
        bodyContent: (<div className="alert alert-danger" role="alert">
          <p>Por favor, preencha todos os campos obrigatórios com valores válidos: Comprimento, Altura e Valor.</p>
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

    // Faz os cálculos
    const comprimentoNum = formatValue(inputComprimento);
    const alturaNum = formatValue(inputAltura);
    const valorNum = formatValue(inputValor);
    const area = comprimentoNum * alturaNum;
    const preco = valorNum * area;

    // Adiciona uma nova linha na tabela
    const newRow = {
      id: tableRows.length + 1,
      medidas: `${inputComprimento} × ${inputAltura}`,
      area: formatNumberSquareMeters(area),
      descricao: inputDescricao,
      valor: `R$ ${inputValor}`,
      preco: `R$ ${formatNumber(preco)}`,
    };

    // Atualiza o estado com a nova linha
    const updatedRows = [...tableRows, newRow];
    setTableRows(updatedRows);

    // Calcula a soma total das áreas
    const totalArea = updatedRows.reduce((acc, row) => {
      const areaValue = parseFloat(row.area.replace(/\./g, '').replace(',', '.'));
      return acc + areaValue;
    }, 0);

    // Calcula o subtotal somando todos os preços
    const subtotal = updatedRows.reduce((acc, row) => {
      const precoValue = parseFloat(row.preco.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
      return acc + precoValue;
    }, 0);

    // Atualiza os estados com os valores calculados    
    setTotalArea(totalArea.toFixed(3));
    setSubtotal(subtotal.toFixed(2));
    setInputDesconto('');
    setTotal(subtotal.toFixed(2));

    // Reseta os inputs após submissão
    setInputComprimento('');
    setInputAltura('');
    setInputDescricao('');
    setInputValor('');
  };

  /*FUNÇÃO handleShowDeleteModal FUNCIONANDO E TESTADA NÃO MEXER*/
  const handleShowDeleteModal = (id) => {
    setModalConfig({
      type: 'delete',
      dialogClass: '',
      headerClass: 'bg-danger text-white',
      title: 'Excluir item da lista',
      bodyContent: { id } /*<p>Deseja realmente excluir este item? Item <span className="badge rounded-pill fs-4 text-bg-danger">{id}</span></p>*/,
      footerClass: 'bg-danger-subtle',
      onSave: () => {
        // Filtra as linhas da tabela para remover a linha com o ID correspondente
        const updatedRows = tableRows.filter(row => row.id !== id);

        // Atualiza os IDs das linhas restantes
        const reindexedRows = updatedRows.map((row, index) => ({
          ...row,
          id: index + 1 // Atribui um novo ID sequencial
        }));

        // Recalcula o total da área e o subtotal
        const newTotalArea = reindexedRows.reduce((total, row) => {
          const area = parseFloat(row.area.replace('.', '').replace(',', '.'));
          return total + area;
        }, 0);

        const newSubtotal = reindexedRows.reduce((total, row) => {
          const preco = parseFloat(row.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
          return total + preco;
        }, 0);

        // Atualiza os estados para refletir a remoção do item
        setTableRows(reindexedRows);
        setTotalArea(newTotalArea);
        setSubtotal(newSubtotal);
        setInputDesconto('');
        setTotal(newSubtotal);
        handleClose();
      },
      btnCloseTxt: 'Cancelar',
      btnCloseClass: 'secondary',
      btnSaveTxt: 'Excluir',
      btnSaveClass: 'danger',
    });    
    setShowModal(true);
  };


  /*FUNÇÃO handleShowEditModal FUNCIONANDO E TESTADA NÃO MEXER*/
  const handleShowEditModal = (id, medidas, descricao, valor) => {
    const [comprimento, altura] = medidas.split(' × ');

    setModalConfig({
      type: 'edit',
      dialogClass: 'modal-xl',
      headerClass: 'bg-primary text-white',
      title: 'Editar item ' + id,
      bodyContent: {
        id: id,
        comprimento: comprimento,
        altura: altura,
        descricao: descricao,
        valor: valor
      },
      footerClass: 'bg-primary-subtle',
      btnCloseTxt: 'Cancelar',
      btnCloseClass: 'secondary',
      btnSaveTxt: 'Editar',
      btnSaveClass: 'primary',
      onSave: (updatedContent) => {
        // Atualiza a linha correspondente na tabela
        const updatedRows = tableRows.map(row => {
          if (row.id === id) {

            // Faz os cálculos
            const comprimento = formatValue(updatedContent.comprimento);
            const altura = formatValue(updatedContent.altura);
            const valor = formatValue(updatedContent.valor);
            const area = comprimento * altura;
            const preco = valor * area;

            return {
              ...row,
              medidas: `${updatedContent.comprimento} × ${updatedContent.altura}`,
              area: `${formatNumberSquareMeters(area)}`,
              descricao: `${updatedContent.descricao}`,
              valor: `R$ ${updatedContent.valor}`,
              preco: `R$ ${formatNumber(preco)}`
            };
          }
          return row;
        });

        // Funções para recalcular o total da área e o subtotal
        const calculateTotalArea = (rows) => {
          return rows.reduce((total, row) => {
            const areaValue = parseFloat(row.area.replace('.', '').replace(',', '.'));
            return total + areaValue;
          }, 0);
        };

        const calculateSubtotal = (rows) => {
          return rows.reduce((total, row) => {
            const precoValue = parseFloat(row.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
            return total + precoValue;
          }, 0);
        };

        // Atualiza os estados
        setTableRows(updatedRows);
        setTotalArea(calculateTotalArea(updatedRows));
        setSubtotal(calculateSubtotal(updatedRows));
        setInputDesconto('');
        setTotal(calculateSubtotal(updatedRows));
        handleClose();
      }
    });
    setShowModal(true);
  };

  const handleDiscount = () => {
    const descontoValue = parseFloat(inputDesconto.replace('.', '').replace(',', '.')) || 0;

    let descontoAplicado;

    // Validação para desconto percentual
    if (tipoDesconto === '%' && descontoValue > 100) {
      setTotal(subtotal);
      setInputDesconto('');  // Limpa o campo de desconto    

      setModalConfig({
        type: '',
        dialogClass: '',
        headerClass: 'bg-danger text-white',
        title: 'Alerta.....',
        bodyContent: (<div className="alert alert-danger" role="alert">
          <p>O desconto percentual não pode ser maior que 100%.</p>
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
      return; // Interrompe a execução se a validação falhar      
    }

    // Validação para desconto monetário
    if (tipoDesconto === '$' && descontoValue > subtotal) {
      setTotal(subtotal);
      setInputDesconto('');  // Limpa o campo de desconto

      setModalConfig({
        type: '',
        dialogClass: '',
        headerClass: 'bg-danger text-white',
        title: 'Alerta.....',
        bodyContent: (<div className="alert alert-danger" role="alert">
          <p>O desconto em dinheiro não pode ser maior que o subtotal.</p>
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
      return; // Interrompe a execução se a validação falhar
    }

    if (tipoDesconto === '%') {
      descontoAplicado = subtotal * (descontoValue / 100);
    } else {
      descontoAplicado = descontoValue;
    }

    const newTotal = subtotal - descontoAplicado;
    setTotal(newTotal.toFixed(2));
  };

  const handleTipoDescontoChange = (event) => {
    // Atualiza o tipo de desconto (percentual ou monetário) com base no valor selecionado
    setTipoDesconto(event.target.value);

    // Limpa o valor do campo de desconto para garantir que o usuário insira um novo valor
    setInputDesconto('');

    // Reseta o total para o valor do subtotal, removendo qualquer desconto anterior
    setTotal(subtotal);
  };

  const handleShareWhatsapp = () => {
    if (tableRows.length === 0) {

      setModalConfig({
        type: '',
        dialogClass: '',
        headerClass: 'bg-danger text-white',
        title: 'Alerta.....',
        bodyContent: (<div className="alert alert-danger" role="alert">
          <p>Adicione itens na tabela para poder enviar via WhatsApp.</p>
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

    // Continuação do código para preparar a mensagem do WhatsApp
    let iten = "";
    tableRows.forEach((row, index) => {
      const id = row.id;
      const medidas = row.medidas;
      const descricao = row.descricao;
      const area = row.area;
      const preco = row.preco;
      const valor = row.valor;
      iten += `*(${id})* ${descricao}\nMedidas: ${medidas}\nCalc.: ${area}m² × ${valor}\nValor: *${preco}*\n\n`;
    });

    const sub = Number(subtotal);
    const tot = Number(total);
    const des = (sub - tot).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    const texto1 = encodeURIComponent(`*SEGUE ORÇAMENTO REDES DE PROTEÇÃO.*\n\n`);
    const texto2 = encodeURIComponent(iten);
    const texto3 = encodeURIComponent(`Área total......${formatNumberSquareMeters(totalArea)}m²\nSubtotal........${(sub.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}\nDesconto......${(des).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nTotal Avista..*${(tot).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`);

    window.open(`https://api.whatsapp.com/send?text=${texto1}${texto2}${texto3}`);
  };

  const handlePdf = () => {

    // Verifica se a tabela está vazia
    if (tableRows.length === 0) {
      setModalConfig({
        type: '',
        dialogClass: '',
        headerClass: 'bg-danger text-white',
        title: 'Alerta.....',
        bodyContent: (<div className="alert alert-danger" role="alert">
          <p>Adicione itens na tabela para poder gerar PDF.</p>
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
      return; // Para a execução da função
    }
    const doc = new jsPDF();

    doc.setFontSize(8);
    // Obter a data e hora atual formatada
    const now = new Date();

    const dateStr = now.toLocaleDateString('pt-BR'); // Formato de data: DD/MM/YYYY
    const timeStr = now.toLocaleTimeString('pt-BR'); // Formato de hora: HH:mm:ss

    const formattedDate =
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      now.getFullYear() +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    // Adiciona a data e hora no canto superior direito
    doc.text(`${dateStr} ${timeStr}`, 170, 10); // X=170 para alinhar à direita, Y=10 para o topo

    doc.setFontSize(16);

    // Adiciona texto ao PDF
    doc.text('Orçamento Redes de Proteção', 14, 22);

    // Adiciona a tabela ao PDF usando autoTable
    autoTable(doc, {
      head: [['Medidas', 'M²', 'Descrição', 'Valor M²', 'Preço']],
      body: tableRows.map(row => [row.medidas, row.area, row.descricao, row.valor, row.preco]),
      startY: 30,
    });

    // Adiciona uma linha horizontal após a tabela
    const finalY = doc.previousAutoTable.finalY + 5; // Adiciona uma margem para a linha
    doc.setLineWidth(0.3);
    doc.line(10, finalY, 200, finalY); // Desenha uma linha horizontal

    // Calcula a posição Y onde o footer começará
    const footerY = finalY + 5; // Espaço para o footer

    // Ajusta o tamanho da fonte para o footer
    doc.setFontSize(10);

    // Adiciona o footer com Total m², Subtotal, Desconto, e Total
    doc.text(`Total M²: ${formatNumberSquareMeters(totalArea)}`, 41, footerY);
    doc.text(`Subtotal: ${(Number(subtotal)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 145, footerY);
    doc.text(`Desconto: ${(Number(subtotal) - Number(total)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 145, footerY + 5);
    doc.text(`Total: ${(Number(total)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 145, footerY + 10);

    // Salva o PDF com o nome desejado
    doc.save(`orcamento${formattedDate}.pdf`);
  };

  //monitora o estado da tabela e atribui estado ao footer onde estao o TOTAL,SUBTOTAL e DESCONTO
  useEffect(() => {
    if (Array.isArray(tableRows) && tableRows.length === 0) {
      setDisplayFooter('none');
    } else {
      setDisplayFooter('block');
    }
  }, [tableRows]);


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
              <h3 className="mb-0 text-white lh-100"> <i className="bi bi-calculator"></i> Orçamento Rápido</h3>
            </div>
          </div>
          <div className='alert alert-primary' role="alert">
            <div className='container'>
              <div className='row'>
                <div className="col-md-4 mb-2">
                  <div className="input-group">
                    <input
                      id='inputComprimento'
                      placeholder='Comprimento'
                      className="form-control placeholder-primary input-text-right input-placeholder-center"
                      value={inputComprimento}
                      onChange={(e) => setInputComprimento(mascaraNumero(e.target.value))}
                    />
                    <span className="input-group-text bg-primary-subtle text-primary-emphasis">X</span>
                    <input
                      id='inputAltura'
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
                    id="inputDescricao"
                    className="form-control placeholder-primary"
                    placeholder="Descrição"
                    value={inputDescricao}
                    onChange={(e) => setInputDescricao(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <div className="row">
                    <div className='col-md-8 col-6'>
                      <input
                        id='inputValor'
                        placeholder='Valor R$'
                        className="form-control placeholder-primary input-text-right input-placeholder-center"
                        value={inputValor}
                        onChange={(e) => setInputValor(mascaraNumero(e.target.value))}
                      />
                    </div>
                    <div className='col-md-4 col-6'>
                      <button type="button" className="btn btn-primary w-100" onClick={handleSubmit} title='Adicionar item a lista'>Adicionar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*não mexer nsta parte pois ja está certo exeplo de como quero a parte de baixo */}
          <div className='container'>
            {tableRows.map((row, index) => (
              <div className='bg-primary-subtle row border border-primary-subtle rounded mb-3' key={index}>
                {/* Primeira linha (ID, Medidas, M²) */}
                <div className='col-12 col-md-4 d-flex justify-content-center align-items-center flex-wrap p-0'>
                  <div className='col-2 text-center'>
                    <span className='badge text-bg-primary'>{row.id}</span>
                  </div>
                  <div className='col-5 text-center'>
                    <div className='text-primary-emphasis fw-semibold'>Medidas</div>
                    <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>{row.medidas}</div>
                  </div>
                  <div className='col-5 text-center'>
                    <div className='text-primary-emphasis fw-semibold'>M²</div>
                    <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>{row.area}</div>
                  </div>
                </div>

                {/* Segunda linha (Descrição) */}
                <div className='col-12 col-md-3 text-center p-0'>
                  <div className='text-primary-emphasis fw-semibold'>Descrição</div>
                  <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>{row.descricao}</div>
                </div>

                {/* Terceira linha (Valor M², Preço, Ação) */}
                <div className='col-12 col-md-5 d-flex justify-content-center align-items-center flex-wrap p-0'>
                  <div className='col-4 text-center'>
                    <div className='text-primary-emphasis fw-semibold'>Valor M²</div>
                    <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>{row.valor}</div>
                  </div>
                  <div className='col-5 text-center'>
                    <div className='text-primary-emphasis fw-semibold'>Preço</div>
                    <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>{row.preco}</div>
                  </div>
                  <div className='col-3 text-center'>
                    <div className='text-primary-emphasis fw-semibold'>Ação</div>
                    <div className='bg-white d-flex justify-content-center align-items-center' style={{ height: '32px' }}>
                      <div className='btn-group' role='group'>
                        <button type='button' className='btn btn-primary btn-sm' onClick={() => handleShowEditModal(row.id, row.medidas, row.descricao, row.valor)} title='Editar item'>
                          <i className='bi bi-pencil-square md-18'></i>
                        </button>
                        <button type='button' className='btn btn-danger btn-sm' onClick={() => handleShowDeleteModal(row.id)} title='Excluir item'>
                          <i className='bi bi-trash md-18'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-secondary-subtle border border-secondary-subtle rounded-bottom mb-2' style={{display: displayFooter}}>
            <div className='container'>

              {/* Seção Total M² e Subtotal */}
              <div className='row border border-dark-subtle rounded mt-2 mb-2 text-center'>
                <div className='bg-dark-subtle'>
                  <div className='row text-primary-emphasis fw-semibold'>

                    {/* Coluna Total M² */}
                    <div className='col-md-4 col-6 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-md-7 d-none d-md-block'></div> {/* Oculto no mobile */}
                      <div className='col-md-5 col-12'>Total M²</div>
                    </div>

                    {/* Espaço vazio oculto em mobile */}
                    <div className='col-md-3 d-none d-md-block'></div>

                    {/* Coluna Subtotal */}
                    <div className='col-6 col-md-5 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-md-4 d-none d-md-block'></div> {/* Oculto no mobile */}
                      <div className='col-12 col-md-5'>Subtotal</div>
                      <div className='col-md-3 d-none d-md-block'></div> {/* Oculto no mobile */}
                    </div>
                  </div>
                </div>

                <div className=''>
                  <div className='row'>

                    {/* Valor Total M² */}
                    <div className='col-6 col-md-4 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-md-7 d-none d-md-block'></div> {/* Oculto no mobile */}
                      <div className='col-12 col-md-5'>{formatNumberSquareMeters(totalArea)} M²</div>
                    </div>

                    {/* Espaço vazio oculto em mobile */}
                    <div className='col-md-3 d-none d-md-block'></div>

                    {/* Valor Subtotal */}
                    <div className='col-md-5 col-6 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-md-4 d-none d-md-block'></div> {/* Oculto no mobile */}
                      <div className='col-12 col-md-5'>R$ {formatNumber(subtotal)}</div>
                      <div className='col-md-3 d-none d-md-block'></div> {/* Oculto no mobile */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção Tipo Desconto e Total */}
              <div className='row border border-dark-subtle rounded mt-2 mb-2 text-center'>
                <div className='bg-dark-subtle'>
                  <div className='row text-primary-emphasis fw-semibold'>

                    {/* Espaço vazio oculto em mobile */}
                    <div className='col-md-4 d-none d-md-block'></div>

                    {/* Tipo Desconto */}
                    <div className='col-4 col-md-3'>Tipo Desconto</div>

                    {/* Coluna Desconto e Total */}
                    <div className='col-8 col-md-5 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-6 col-md-4'>Desconto</div>
                      <div className='col-6 col-md-5'>Total</div>
                      <div className='col-md-3 d-none d-md-block'></div> {/* Oculto no mobile */}
                    </div>
                  </div>
                </div>

                <div className=''>
                  <div className='row d-flex justify-content-center align-items-center flex-wrap p-0'>

                    {/* Espaço vazio oculto em mobile */}
                    <div className='col-4 col-md-4 d-none d-md-block'></div>

                    {/* Input Radio */}
                    <div className='col-4 col-md-3 '>
                      <div className='btn-group' role='group'>
                        <input type='radio' className='btn-check' name="tipoDesconto" id='percentual' value='%' onChange={handleTipoDescontoChange} checked={tipoDesconto === '%'}></input>
                        <label className="btn btn-primary btn-sm" for="percentual"><i className="bi bi-percent" title='Tipo de desconto %'></i></label>

                        <input type='radio' className='btn-check' name="tipoDesconto" id='monetario' value='$' onChange={handleTipoDescontoChange} checked={tipoDesconto === '$'}></input>
                        <label className="btn btn-primary btn-sm" for="monetario"><i className="bi bi-currency-dollar" title='Tipo de desconto $'></i></label>
                      </div>
                    </div>

                    {/* Input Desconto e Total */}
                    <div className='col-8 col-md-5 d-flex justify-content-center align-items-center flex-wrap p-0'>
                      <div className='col-6 col-md-4'>
                        <input
                          id='inputDesconto'
                          placeholder='0,00'
                          className="form-control placeholder-primary input-text-right"
                          value={inputDesconto}
                          onChange={(e) => { setInputDesconto(mascaraNumero(e.target.value)) }}
                          onKeyUp={handleDiscount}
                        />
                      </div>
                      <div className='col-6 col-md-5'>R$ {formatNumber(total)}</div>
                      <div className='col-md-3 d-none d-md-block'></div> {/* Oculto no mobile */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container p-0 mb-2'>
              <button type="button" className="btn btn-success" onClick={handleShareWhatsapp}><i className="bi bi-whatsapp" ></i> Enviar por WhatsApp</button>
              <button type="button" className="btn btn-primary mx-2" onClick={handlePdf}><i className="bi bi-filetype-pdf"></i> Gerar PDF</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CalcOrcamentoRapido;
