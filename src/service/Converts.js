// Formata para o fomato moeda em REAL BRASIL.
export default function formatCurrency(value, digito) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: digito, // Define o número mínimo de casas decimais
        maximumFractionDigits: digito  // Define o número máximo de casas decimais
    }).format(value);
}

// Formata o percentual com uma casa decimal
export  function formatArredondado(value) {
    return `${parseFloat(value).toFixed(0)}`;
}