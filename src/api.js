const URL_BASE = 'https://parallelum.com.br/fipe/api/v1';

async function buscarDados(caminho) {
  let resposta;
  try {
    resposta = await fetch(URL_BASE + caminho);
  } catch (erro) {
    throw new Error('Sem conexão com a internet. Verifique e tente de novo.');
  }

  if (!resposta.ok) {
    throw new Error(`A API da FIPE respondeu com erro (${resposta.status}). Tente de novo.`);
  }

  return resposta.json();
}

export async function buscarMarcas(tipo) {
  const dados = await buscarDados(`/${tipo}/marcas`);
  return dados.map((marca) => ({ codigo: String(marca.codigo), nome: marca.nome }));
}

export async function buscarModelos(tipo, codigoMarca) {
  const dados = await buscarDados(`/${tipo}/marcas/${codigoMarca}/modelos`);
  return dados.modelos.map((modelo) => ({ codigo: String(modelo.codigo), nome: modelo.nome }));
}
