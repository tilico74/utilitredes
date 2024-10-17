import React from 'react';
import buscaCep from '../imgs/home/buscaCep.png';
import whatsApp from '../imgs/home/whatsApp.png';
import redesProtecao from '../imgs/home/orcRedesdeProtecao.png';

const Index = () => {
    return (
        <>
            <div className="container-fluid text-center">
                <div className="row bg-secondary-subtle">
                    <div className="col-md-6 col-lg-3 my-3">
                        <a href='/busca-cep'>
                            <div className="rounded-div rounded-4" style={{ backgroundImage: `url(${buscaCep})` }}>
                                <div className="overlay-text text-center">Pesquise rapidamente CEP</div>
                            </div>
                        </a>
                    </div>

                    <div className="col-md-6 col-lg-3 my-3">
                        <a href='/calc-orcamento-rapido'>
                            <div className="rounded-div rounded-4" style={{ backgroundImage: `url(${redesProtecao})` }}>
                                <div className="overlay-text text-center">Crie orçamento de <span>Redes de Proteção</span> facíl</div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-lg-3 my-3">
                        <a href='/calc-orcamento-rapido'>
                            <div className="rounded-div rounded-4" style={{ backgroundImage: `url(${whatsApp})` }}>
                                <div className="overlay-text">Conversar sem adicionar contato</div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-lg-3 my-3">
                        <a href='/conversa-por-whatsapp'>
                            <div className="rounded-div rounded-4" style={{ backgroundImage: 'url("https://via.placeholder.com/300")' }}>
                                <div className="overlay-text">Div 4</div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12 col-md-5 col-lg-4 my-3">
                        <h6>Quanto nós brasileiros já pagamos de impostos este ano</h6>
                        <iframe id="impostometro" src="https://impostometro.com.br/widget/contador/" width="390" height="100" scrolling="no" frameBorder="0" title='Impostometro'></iframe>
                    </div>
                    <div className="col-md-6 col-lg-3 my-3 bg-success">
                        
                    </div>

                </div>
            </div>
        </>
    );
};

export default Index;
