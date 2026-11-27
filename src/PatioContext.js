import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularValor } from './calculo';

const CHAVE_STORAGE = 'vagou:dados';
const VAGAS_PADRAO = 40;

const PIX_PADRAO = { chave: '', nome: 'Vagou Estacionamento', cidade: 'Sao Paulo' };

const TARIFAS_PADRAO = [
  { id: 'carro', nome: 'Carro', tipoFipe: 'carros', toleranciaMin: 10, primeiraHora: 10, horaAdicional: 5, meiaDiaria: 30, diaria: 45 },
  { id: 'moto', nome: 'Moto', tipoFipe: 'motos', toleranciaMin: 10, primeiraHora: 6, horaAdicional: 3, meiaDiaria: 18, diaria: 25 },
  { id: 'utilitario', nome: 'Utilitário', tipoFipe: 'caminhoes', toleranciaMin: 10, primeiraHora: 14, horaAdicional: 7, meiaDiaria: 40, diaria: 60 },
];

export const FORMAS_PAGAMENTO = [
  { valor: 'dinheiro', rotulo: 'Dinheiro' },
  { valor: 'pix', rotulo: 'PIX' },
  { valor: 'cartao', rotulo: 'Cartão' },
];

export function nomePagamento(valor) {
  const forma = FORMAS_PAGAMENTO.find((item) => item.valor === valor);
  return forma ? forma.rotulo : valor;
}

const PatioContext = createContext(null);

export function PatioProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [tarifas, setTarifas] = useState(TARIFAS_PADRAO);
  const [vagas, setVagas] = useState(VAGAS_PADRAO);
  const [proximoNumero, setProximoNumero] = useState(1);
  const [pix, setPix] = useState(PIX_PADRAO);
  const [carregando, setCarregando] = useState(true);

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

  useEffect(() => {
    if (carregando) {
      return;
    }
    const dados = { tickets, tarifas, vagas, proximoNumero, pix };
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados)).catch((erro) =>
      console.log('Erro ao salvar os dados:', erro)
    );
  }, [tickets, tarifas, vagas, proximoNumero, pix, carregando]);

  const noPatio = tickets.filter((ticket) => ticket.status === 'aberto');

  const historico = tickets
    .filter((ticket) => ticket.status === 'pago')
    .sort((a, b) => b.saida - a.saida);

  function buscarTarifa(tarifaId) {
    return tarifas.find((tarifa) => tarifa.id === tarifaId) || tarifas[0];
  }

  function buscarTicket(id) {
    return tickets.find((ticket) => ticket.id === id);
  }

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

  function alternarDiaria(id) {
    setTickets(tickets.map((ticket) => (ticket.id === id ? { ...ticket, diaria: !ticket.diaria } : ticket)));
  }

  function cancelarEntrada(id) {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  }

  function salvarTarifas(novasTarifas, novasVagas, novoPix) {
    setTarifas(novasTarifas);
    setVagas(novasVagas);
    setPix(novoPix);
  }

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

export function usePatio() {
  return useContext(PatioContext);
}
