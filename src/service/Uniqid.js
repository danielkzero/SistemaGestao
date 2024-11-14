export default function uniqid() {
    const timestamp = Date.now().toString(); // Obtém o timestamp atual em milissegundos
    const randomPart = Math.floor(Math.random() * 1e10).toString().padStart(10, '0'); // Gera um número aleatório de 10 dígitos, preenchendo zeros à esquerda, se necessário
    const uniqueId = timestamp + randomPart; // Combina o timestamp e o número aleatório
    return uniqueId.slice(0, 20); // Retorna apenas os primeiros 20 caracteres
}
