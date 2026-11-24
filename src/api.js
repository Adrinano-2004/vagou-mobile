// comunicacao com a API da Tabela FIPE (gratuita, sem chave)
// documentacao: https://deividfortuna.github.io/fipe/
const URL_BASE = 'https://parallelum.com.br/fipe/api/v1';

// tipo: 'carros', 'motos' ou 'caminhoes'
// devolve [{ codigo: '59', nome: 'VW - VolksWagen' }, ...]
export async function buscarMarcas(tipo) {
  const resposta = await fetch(`${URL_BASE}/${tipo}/marcas`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as marcas. Verifique a internet.');
  }

  const dados = await resposta.json();
  return dados.map((marca) => ({ codigo: String(marca.codigo), nome: marca.nome }));
}

// devolve os modelos de uma marca: [{ codigo: '5585', nome: 'AMAROK ...' }, ...]
export async function buscarModelos(tipo, codigoMarca) {
  const resposta = await fetch(`${URL_BASE}/${tipo}/marcas/${codigoMarca}/modelos`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os modelos. Verifique a internet.');
  }

  const dados = await resposta.json();
  return dados.modelos.map((modelo) => ({ codigo: String(modelo.codigo), nome: modelo.nome }));
}
