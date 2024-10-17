import React, { useState } from 'react';

function InputMaskNumber({ id, placeholder}) {

    const [value, setValue] = useState('');

    const formatCurrency = (value) => {
        value = value.replace(/\D/g, ""); // Remove tudo que não for dígito
        value = (value / 100).toFixed(2) + ""; // Divide por 100 e fixa 2 casas decimais
        value = value.replace(".", ","); // Substitui ponto por vírgula
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona os pontos de milhar
        return value;
    };

    const handleChange = (e) => {
        const maskedValue = formatCurrency(e.target.value);
        setValue(maskedValue);
        
    };
    return (
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="form-control"
            aria-label={placeholder}
            required                                                                
        />
    );
}
export default InputMaskNumber;