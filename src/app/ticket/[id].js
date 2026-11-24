import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { usePatio, FORMAS_PAGAMENTO, nomePagamento } from '../../PatioContext';
import { calcularValor, formatarMoeda, formatarTempo, formatarDataHora } from '../../calculo';
import useAgora from '../../useAgora';
import Placa from '../../components/Placa';
import Opcoes from '../../components/Opcoes';
import Botao from '../../components/Botao';
import Estado from '../../components/Estado';
import QrPix from '../../components/QrPix';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_LIVRE, COR_OCUPADO, COR_PRINCIPAL } from '../../tema';

// ===== configuracoes do ticket (mudar aqui) =====
const PAGAMENTO_PADRAO = 'dinheiro';   // forma que ja vem marcada: 'dinheiro', 'pix' ou 'cartao'
// =============================================

// rota dinamica: o [id] do nome do arquivo vira um parametro (ex: /ticket/1732460000000)
export default function DetalheTicket() {
  const { id, nova } = useLocalSearchParams();
  const { buscarTicket, buscarTarifa, registrarSaida, alternarDiaria, cancelarEntrada, pix, carregando } = usePatio();
  const [pagamento, setPagamento] = useState(PAGAMENTO_PADRAO);
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);
  const [saiuAgora, setSaiuAgora] = useState(false);
  const agora = useAgora(15); // o valor vai atualizando enquanto a tela esta aberta

  const ticket = buscarTicket(id);

  if (carregando) {
    return <Estado carregando />;
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.tela} edges={['bottom']}>
        <Estado erro="Ticket não encontrado." />
        <Botao titulo="Voltar" contorno onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const tarifa = buscarTarifa(ticket.tarifaId);
  const aberto = ticket.status === 'aberto';
  const calculo = calcularValor(tarifa, ticket.entrada, aberto ? agora : ticket.saida, ticket.diaria);
  const numero = String(ticket.numero).padStart(4, '0');

  function sair() {
    registrarSaida(ticket.id, pagamento);
    setSaiuAgora(true);
  }

  // o cancelamento pede 2 toques, pra ninguem apagar uma entrada sem querer
  function cancelar() {
    if (!confirmarCancelamento) {
      setConfirmarCancelamento(true);
      return;
    }
    router.back();
    cancelarEntrada(ticket.id);
  }

  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      {/* muda o titulo do cabecalho do Stack */}
      <Stack.Screen options={{ title: `Ticket #${numero}` }} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        {nova === '1' && aberto && <Text style={styles.sucesso}>✓ Entrada registrada!</Text>}
        {saiuAgora && <Text style={styles.sucesso}>✓ Saída registrada!</Text>}

        <View style={styles.topo}>
          <Placa placa={ticket.placa} grande />
          <Text style={styles.modelo}>
            {[ticket.marca, ticket.modelo].filter(Boolean).join(' · ') || 'Modelo não informado'}
          </Text>
          <Text style={styles.apoio}>{[tarifa.nome, ticket.cor].filter(Boolean).join(' · ')}</Text>
          <Text style={[styles.status, { backgroundColor: aberto ? COR_PRINCIPAL : COR_LIVRE }]}>
            {aberto ? 'NO PÁTIO' : 'PAGO'}
          </Text>
        </View>

        <View style={styles.card}>
          <Linha titulo="Entrada" valor={formatarDataHora(ticket.entrada)} />
          {!aberto && <Linha titulo="Saída" valor={formatarDataHora(ticket.saida)} />}
          <Linha titulo="Permanência" valor={formatarTempo(calculo.minutos)} />
          <Linha titulo="Tarifa" valor={ticket.diaria ? `${tarifa.nome} · Diária` : tarifa.nome} />
          {!aberto && <Linha titulo="Pagamento" valor={nomePagamento(ticket.pagamento)} />}
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>{aberto ? 'Valor até agora' : 'Valor pago'}</Text>
          {calculo.detalhe.map((linha) => (
            <Text key={linha} style={styles.apoio}>
              • {linha}
            </Text>
          ))}
          <Text style={styles.total}>{formatarMoeda(aberto ? calculo.valor : ticket.valor)}</Text>
        </View>

        {aberto ? (
          <View>
            <Text style={styles.rotulo}>Forma de pagamento</Text>
            <Opcoes opcoes={FORMAS_PAGAMENTO} selecionado={pagamento} onSelecionar={setPagamento} />
            {/* no PIX aparece o QR code com o valor; dinheiro e cartao seguem direto */}
            {pagamento === 'pix' && <QrPix pix={pix} valor={calculo.valor} identificador={`TICKET${numero}`} />}
            <Botao titulo={`Registrar saída · ${formatarMoeda(calculo.valor)}`} icone="exit-outline" onPress={sair} />
            <Botao
              titulo={ticket.diaria ? 'Voltar a cobrar por hora' : `Lançar diária · ${formatarMoeda(tarifa.diaria)}`}
              icone="sunny-outline"
              contorno
              onPress={() => alternarDiaria(ticket.id)}
            />
            <Botao
              titulo={confirmarCancelamento ? 'Toque de novo para confirmar' : 'Cancelar entrada'}
              icone="trash-outline"
              cor={COR_OCUPADO}
              contorno={!confirmarCancelamento}
              onPress={cancelar}
            />
          </View>
        ) : (
          <Botao titulo="Voltar" icone="arrow-back" contorno onPress={() => router.back()} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// componente pequeno so desta tela: uma linha "titulo ...... valor"
function Linha({ titulo, valor }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.apoio}>{titulo}</Text>
      <Text style={styles.valorLinha}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR_FUNDO,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 30,
  },
  sucesso: {
    backgroundColor: COR_LIVRE,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },
  topo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modelo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COR_TEXTO,
    textAlign: 'center',
    marginTop: 12,
  },
  apoio: {
    color: COR_APOIO,
    fontSize: 14,
    marginTop: 2,
  },
  status: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  tituloCard: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  total: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginTop: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  valorLinha: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COR_TEXTO,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
});
