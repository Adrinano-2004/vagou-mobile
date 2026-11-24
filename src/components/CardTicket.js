import { View, Text, Pressable, StyleSheet } from 'react-native';
import Placa from './Placa';
import { usePatio, nomePagamento } from '../PatioContext';
import { calcularValor, formatarMoeda, formatarTempo, formatarHora, formatarDataHora } from '../calculo';
import { COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_LIVRE } from '../tema';

// card de um veiculo, usado no Patio, no Historico e no Painel
// - veiculo no patio: mostra o tempo ate agora e o valor parcial
// - veiculo que ja saiu: mostra o valor pago e a forma de pagamento
export default function CardTicket({ ticket, agora, onPress }) {
  const { buscarTarifa } = usePatio();
  const tarifa = buscarTarifa(ticket.tarifaId);
  const aberto = ticket.status === 'aberto';

  const fim = aberto ? agora || Date.now() : ticket.saida;
  const calculo = calcularValor(tarifa, ticket.entrada, fim);

  const descricao = [ticket.marca, ticket.modelo].filter(Boolean).join(' · ') || 'Modelo não informado';
  const detalhes = [tarifa.nome, ticket.cor].filter(Boolean).join(' · ');

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressionado]} onPress={onPress}>
      <Placa placa={ticket.placa} />

      <View style={styles.meio}>
        <Text style={styles.modelo} numberOfLines={1}>
          {descricao}
        </Text>
        <Text style={styles.apoio} numberOfLines={1}>
          {detalhes}
        </Text>
        <Text style={styles.apoio}>
          {aberto ? `Entrou às ${formatarHora(ticket.entrada)}` : `Saiu ${formatarDataHora(ticket.saida)}`}
        </Text>
      </View>

      <View style={styles.direita}>
        <Text style={styles.valor}>{formatarMoeda(aberto ? calculo.valor : ticket.valor)}</Text>
        {aberto ? (
          <Text style={styles.tempo}>{formatarTempo(calculo.minutos)}</Text>
        ) : (
          <Text style={[styles.tempo, styles.pago]}>{nomePagamento(ticket.pagamento)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  pressionado: {
    opacity: 0.7,
  },
  meio: {
    flex: 1,
  },
  modelo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COR_TEXTO,
  },
  apoio: {
    fontSize: 13,
    color: COR_APOIO,
    marginTop: 2,
  },
  direita: {
    alignItems: 'flex-end',
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COR_TEXTO,
  },
  tempo: {
    fontSize: 13,
    color: COR_APOIO,
    marginTop: 2,
  },
  pago: {
    color: COR_LIVRE,
    fontWeight: 'bold',
  },
});
