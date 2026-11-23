import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COR_FUNDO, COR_APOIO } from '../../tema';

// TODO: conteúdo real (etapa 7)
export default function Sobre() {
  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <Text style={styles.titulo}>Sobre</Text>
      <Text style={styles.texto}>Vagou Mobile, por Adriano e Arthur Villela.</Text>
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
