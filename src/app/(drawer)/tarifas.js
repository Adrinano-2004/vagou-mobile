import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COR_FUNDO, COR_APOIO } from '../../tema';

// TODO: conteúdo real (etapa 7)
export default function Tarifas() {
  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <Text style={styles.titulo}>Tarifas</Text>
      <Text style={styles.texto}>Tabela de preços de cada tipo de veículo e total de vagas.</Text>
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
