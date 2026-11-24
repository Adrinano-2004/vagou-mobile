import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularValor } from './calculo';

// ===== configuracoes iniciais (mudar aqui) =====
const CHAVE_STORAGE = 'vagou:dados';   // nome do "arquivo" salvo no aparelho
const VAGAS_PADRAO = 40;               // total de vagas do estacionamento
// quem recebe o PIX (o dono preenche a chave na tela Tarifas)
const PIX_PADRAO = { chave: '', nome: 'Vagou Estacionamento', cidade: 'Sao Paulo' };
// =============================================

// tabela de precos que o app usa na primeira vez (depois o usuario edita na tela Tarifas)
// tipoFipe diz em qual lista da API FIPE ficam as marcas desse tipo de veiculo
const TARIFAS_PADRAO = [
  { id: 'carro', nome: 'Carro', tipoFipe: 'carros', toleranciaMin: 10, primeiraHora: 10, horaAdicional: 5, meiaDiaria: 30, diaria: 45 },
  { id: 'moto', nome: 'Moto', tipoFipe: 'motos', toleranciaMin: 10, primeiraHora: 6, horaAdicional: 3, meiaDiaria: 18, diaria: 25 },
  { id: 'utilitario', nome: 'Utilitário', tipoFipe: 'caminhoes', toleranciaMin: 10, primeiraHora: 14, horaAdicional: 7, meiaDiaria: 40, diaria: 60 },
];

// formas de pagamento aceitas na saida
export const FORMAS_PAGAMENTO = [
  { valor: 'dinheiro', rotulo: 'Dinheiro' },
  { valor: 'pix', rotulo: 'PIX' },
  { valor: 'cartao', rotulo: 'Cartão' },
];

// 'pix' -> 'PIX'
export function nomePagamento(valor) {
  const forma = FORMAS_PAGAMENTO.find((item) => item.valor === valor);
  return forma ? forma.rotulo : valor;
}

const PatioContext = createContext(null);

// guarda os dados do estacionamento e compartilha com todas as telas
export function PatioProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [tarifas, setTarifas] = useState(TARIFAS_PADRAO);
  const [vagas, setVagas] = useState(VAGAS_PADRAO);
  const [proximoNumero, setProximoNumero] = useState(1);
  const [pix, setPix] = useState(PIX_PADRAO);
  const [carregando, setCarregando] = useState(true);

  // 1) quando o app abre: le os dados salvos no aparelho (so uma vez, por causa do [])
  useEffect(() => {
    async function carregar() {
      try {
        const texto = await AsyncStorage.getItem(CHAVE_STORAGE);
        if (texto) {
          const dados = JSON.parse(texto);
          setTickets(dados.tickets || []);
          setTarifas(dados.tarifas || TARIFAS_PADRAO);
          setVagas(dados.vagas || VAGAS_PADRAO);
          setProximoNumero(dados.proximoNumero || 1);
          setPix(dados.pix || PIX_PADRAO);
        }
      } catch (erro) {
        console.log('Erro ao carregar os dados salvos:', erro);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // 2) sempre que algum dado muda: salva tudo de novo no aparelho
  // (espera terminar de carregar, senao salvaria a lista vazia por cima dos dados)
  useEffect(() => {
    if (carregando) {
      return;
    }
    const dados = { tickets, tarifas, vagas, proximoNumero, pix };
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados)).catch((erro) =>
      console.log('Erro ao salvar os dados:', erro)
    );
  }, [tickets, tarifas, vagas, proximoNumero, pix, carregando]);

  // veiculos que ainda estao no estacionamento
  const noPatio = tickets.filter((ticket) => ticket.status === 'aberto');

  // saidas ja pagas, da mais nova pra mais antiga
  const historico = tickets
    .filter((ticket) => ticket.status === 'pago')
    .sort((a, b) => b.saida - a.saida);

  function buscarTarifa(tarifaId) {
    return tarifas.find((tarifa) => tarifa.id === tarifaId) || tarifas[0];
  }

  function buscarTicket(id) {
    return tickets.find((ticket) => ticket.id === id);
  }

  // registra um veiculo entrando. Se algo estiver errado, lanca um Error com a mensagem
  // diaria = true: cobra o valor fixo da diaria (cliente que vai passar o dia)
  function registrarEntrada({ placa, tarifaId, marca, modelo, cor, diaria = false }) {
    if (noPatio.length >= vagas) {
      throw new Error('Pátio lotado: não há vagas livres.');
    }
    if (noPatio.some((ticket) => ticket.placa === placa)) {
      throw new Error(`A placa ${placa} já está no pátio.`);
    }

    const novo = {
      id: String(Date.now()),
      numero: proximoNumero,
      placa,
      tarifaId,
      marca,
      modelo,
      cor,
      diaria,
      entrada: Date.now(),
      status: 'aberto',
    };

    setTickets([novo, ...tickets]);
    setProximoNumero(proximoNumero + 1);
    return novo;
  }

  // registra a saida: calcula o valor e marca o ticket como pago
  function registrarSaida(id, pagamento) {
    const agora = Date.now();
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id !== id) {
          return ticket;
        }
        const calculo = calcularValor(buscarTarifa(ticket.tarifaId), ticket.entrada, agora, ticket.diaria);
        return { ...ticket, saida: agora, valor: calculo.valor, pagamento, status: 'pago' };
      })
    );
  }

  // lanca a diaria num veiculo que ja esta no patio (ou desfaz, se ja estava lancada)
  function alternarDiaria(id) {
    setTickets(tickets.map((ticket) => (ticket.id === id ? { ...ticket, diaria: !ticket.diaria } : ticket)));
  }

  // apaga uma entrada registrada por engano
  function cancelarEntrada(id) {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  }

  // troca as tarifas, o total de vagas e os dados do PIX pelos valores editados
  function salvarTarifas(novasTarifas, novasVagas, novoPix) {
    setTarifas(novasTarifas);
    setVagas(novasVagas);
    setPix(novoPix);
  }

  // volta o app ao estado inicial (usado na tela Sobre)
  function apagarTudo() {
    setTickets([]);
    setTarifas(TARIFAS_PADRAO);
    setVagas(VAGAS_PADRAO);
    setProximoNumero(1);
    setPix(PIX_PADRAO);
  }

  return (
    <PatioContext.Provider
      value={{
        tickets,
        noPatio,
        historico,
        tarifas,
        vagas,
        pix,
        carregando,
        buscarTarifa,
        buscarTicket,
        registrarEntrada,
        registrarSaida,
        alternarDiaria,
        cancelarEntrada,
        salvarTarifas,
        apagarTudo,
      }}
    >
      {children}
    </PatioContext.Provider>
  );
}

// atalho pras telas usarem: const { noPatio } = usePatio();
export function usePatio() {
  return useContext(PatioContext);
}
