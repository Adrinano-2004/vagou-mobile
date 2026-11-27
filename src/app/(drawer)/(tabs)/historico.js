import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { usePatio } from '../../../PatioContext';
import { ehHoje, formatarMoeda } from '../../../calculo';
import CardTicket from '../../../components/CardTicket';
import CampoBusca from '../../../components/CampoBusca';
import Opcoes from '../../../components/Opcoes';
import Estado from '../../../components/Estado';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA } from '../../../tema';

const FILTRO_PADRAO = 'hoje';
const FILTROS = [
  { valor: 'hoje', rotulo: 'Hoje' },
  { valor: 'todos', rotulo: 'Todos' },
];

export default function Historico() {
  const { historico, carregando } = usePatio();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState(FILTRO_PADRAO);

  if (carregando) {
    return <Estado carregando />;
  }

  const texto = busca.trim().toUpperCase();
  const lista = historico
    .filter((ticket) => filtro === 'todos' || ehHoje(ticket.saida))
    .filter((ticket) => `${ticket.placa} ${ticket.marca} ${ticket.modelo}`.toUpperCase().includes(texto));

  const total = lista.reduce((soma, ticket) => soma + ticket.valor, 0);

  return (
    <View style={styles.tela}>
      <CampoBusca valor={busca} onChange={setBusca} placeholder="Pesquisar placa ou modelo" />
      <Opcoes opcoes={FILTROS} selecionado={filtro} onSelecionar={setFiltro} />

      <View style={styles.resumo}>
        <Text style={styles.apoio}>{lista.length} {lista.length === 1 ? 'saída' : 'saídas'}</Text>
        <Text style={styles.total}>{formatarMoeda(total)}</Text>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardTicket ticket={item} onPress={() => router.push(`/ticket/${item.id}`)} />}
        ListEmptyComponent={
          <Estado
            mensagem={historico.length === 0 ? 'Nenhuma saída registrada ainda.' : 'Nenhuma saída encontrada.'}
            icone="receipt-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR_FUNDO,
    padding: 16,
  },
  resumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  apoio: {
    color: COR_APOIO,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COR_TEXTO,
  },
});
