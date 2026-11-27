import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { usePatio } from '../../../PatioContext';
import useAgora from '../../../useAgora';
import CardTicket from '../../../components/CardTicket';
import CampoBusca from '../../../components/CampoBusca';
import Estado from '../../../components/Estado';
import Botao from '../../../components/Botao';
import { COR_FUNDO, COR_APOIO } from '../../../tema';

export default function Patio() {
  const { noPatio, vagas, carregando } = usePatio();
  const [busca, setBusca] = useState('');
  const agora = useAgora(30);

  if (carregando) {
    return <Estado carregando mensagem="Carregando o pátio..." />;
  }

  const texto = busca.trim().toUpperCase();
  const lista = noPatio.filter((ticket) =>
    `${ticket.placa} ${ticket.marca} ${ticket.modelo}`.toUpperCase().includes(texto)
  );

  return (
    <View style={styles.tela}>
      <CampoBusca valor={busca} onChange={setBusca} placeholder="Pesquisar placa ou modelo" />
      <Text style={styles.total}>
        {noPatio.length} de {vagas} vagas ocupadas
      </Text>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardTicket ticket={item} agora={agora} onPress={() => router.push(`/ticket/${item.id}`)} />
        )}
        ListEmptyComponent={
          noPatio.length === 0 ? (
            <Estado mensagem="Nenhum veículo no pátio." icone="car-outline">
              <Botao titulo="Registrar entrada" icone="add" onPress={() => router.push('/entrada')} />
            </Estado>
          ) : (
            <Estado mensagem="Nenhum veículo encontrado." icone="search" />
          )
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
  total: {
    color: COR_APOIO,
    marginBottom: 10,
  },
});
