// comunicacao com a API da Tabela FIPE (gratuita, sem chave)
// documentacao: https://deividfortuna.github.io/fipe/
const URL_BASE = 'https://parallelum.com.br/fipe/api/v1';

// faz o fetch e trata os dois tipos de erro com uma mensagem clara pro usuario
async function buscarDados(caminho) {
  let resposta;
  try {
    resposta = await fetch(URL_BASE + caminho);
  } catch (erro) {
    // o fetch so "quebra" quando nem chega na API (sem internet, por exemplo)
    throw new Error('Sem conexão com a internet. Verifique e tente de novo.');
  }

  // a API respondeu, mas com erro (ex: 429 = muitas consultas, 500 = erro no servidor)
  if (!resposta.ok) {
    throw new Error(`A API da FIPE respondeu com erro (${resposta.status}). Tente de novo.`);
  }

  return resposta.json();
}

// tipo: 'carros', 'motos' ou 'caminhoes'
// devolve [{ codigo: '59', nome: 'VW - VolksWagen' }, ...]
export async function buscarMarcas(tipo) {
  const dados = await buscarDados(`/${tipo}/marcas`);
  return dados.map((marca) => ({ codigo: String(marca.codigo), nome: marca.nome }));
}

// devolve os modelos de uma marca: [{ codigo: '5585', nome: 'AMAROK ...' }, ...]
export async function buscarModelos(tipo, codigoMarca) {
  const dados = await buscarDados(`/${tipo}/marcas/${codigoMarca}/modelos`);
  return dados.modelos.map((modelo) => ({ codigo: String(modelo.codigo), nome: modelo.nome }));
}
