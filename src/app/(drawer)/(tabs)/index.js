import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { usePatio } from '../../../PatioContext';
import { ehHoje, formatarMoeda } from '../../../calculo';
import useAgora from '../../../useAgora';
import CardTicket from '../../../components/CardTicket';
import Estado from '../../../components/Estado';
import Botao from '../../../components/Botao';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_LIVRE, COR_OCUPADO } from '../../../tema';

const QTD_ULTIMAS = 5;

export default function Painel() {
  const { tickets, noPatio, historico, vagas, carregando } = usePatio();
  const agora = useAgora(30);

  if (carregando) {
    return <Estado carregando mensagem="Carregando os dados salvos..." />;
  }

  const ocupadas = noPatio.length;
  const livres = Math.max(0, vagas - ocupadas);
  const ocupacao = vagas > 0 ? Math.min(100, Math.round((ocupadas / vagas) * 100)) : 0;

  const saidasHoje = historico.filter((ticket) => ehHoje(ticket.saida));
  const recebidoHoje = saidasHoje.reduce((soma, ticket) => soma + ticket.valor, 0);
  const entradasHoje = tickets.filter((ticket) => ehHoje(ticket.entrada)).length;

  const ultimas = [...tickets]
    .sort((a, b) => (b.saida || b.entrada) - (a.saida || a.entrada))
    .slice(0, QTD_ULTIMAS);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.card}>
        <Text style={styles.rotulo}>Ocupação do pátio</Text>
        <Text style={styles.numeroGrande}>
          {ocupadas}
          <Text style={styles.deVagas}> / {vagas} vagas</Text>
        </Text>

        <View style={styles.barra}>
          <View
            style={[
              styles.barraCheia,
              { width: `${ocupacao}%`, backgroundColor: livres === 0 ? COR_OCUPADO : COR_TEXTO },
            ]}
          />
        </View>

        <View style={styles.legenda}>
          <Text style={[styles.legendaTexto, { color: COR_LIVRE }]}>● {livres} livres</Text>
          <Text style={styles.legendaTexto}>{ocupacao}% ocupado</Text>
        </View>
      </View>

      <View style={styles.linha}>
        <View style={[styles.card, styles.metade]}>
          <Text style={styles.rotulo}>Recebido hoje</Text>
          <Text style={styles.numero}>{formatarMoeda(recebidoHoje)}</Text>
          <Text style={styles.apoio}>{saidasHoje.length} {saidasHoje.length === 1 ? 'saída' : 'saídas'}</Text>
        </View>
        <View style={[styles.card, styles.metade]}>
          <Text style={styles.rotulo}>Entradas hoje</Text>
          <Text style={styles.numero}>{entradasHoje}</Text>
          <Text style={styles.apoio}>{entradasHoje === 1 ? 'veículo' : 'veículos'}</Text>
        </View>
      </View>

      <Botao titulo="Nova entrada" icone="add" onPress={() => router.push('/entrada')} />

      <Text style={styles.titulo}>Últimas movimentações</Text>
      {ultimas.length === 0 ? (
        <Estado mensagem="Nenhuma movimentação ainda. Registre a primeira entrada!" icone="car-outline" />
      ) : (
        ultimas.map((ticket) => (
          <CardTicket
            key={ticket.id}
            ticket={ticket}
            agora={agora}
            onPress={() => router.push(`/ticket/${ticket.id}`)}
          />
        ))
      )}
    </ScrollView>
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
  card: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  metade: {
    flex: 1,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    textTransform: 'uppercase',
  },
  numeroGrande: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginTop: 4,
  },
  deVagas: {
    fontSize: 18,
    color: COR_APOIO,
    fontWeight: 'normal',
  },
  barra: {
    height: 12,
    backgroundColor: COR_LINHA,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  barraCheia: {
    height: '100%',
    borderRadius: 6,
  },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendaTexto: {
    fontWeight: 'bold',
    color: COR_APOIO,
  },
  numero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginTop: 6,
  },
  apoio: {
    color: COR_APOIO,
    marginTop: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginTop: 20,
    marginBottom: 10,
  },
});
