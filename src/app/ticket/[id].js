import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { COR_FUNDO, COR_APOIO } from '../../tema';

// rota dinamica: o [id] do nome do arquivo vira um parametro
// ex: /ticket/7 -> id = '7'
// TODO: conteúdo real (etapa 6)
export default function DetalheTicket() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <Text style={styles.titulo}>Ticket {id}</Text>
      <Text style={styles.texto}>Entrada, tempo, cálculo do valor e registro da saída.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR_FUNDO,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  texto: {
    color: COR_APOIO,
    textAlign: 'center',
  },
});
