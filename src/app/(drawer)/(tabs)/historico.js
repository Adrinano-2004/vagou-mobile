import { View, Text, StyleSheet } from 'react-native';
import { COR_FUNDO, COR_APOIO } from '../../../tema';

// TODO: conteúdo real (etapa 7)
export default function Historico() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Histórico</Text>
      <Text style={styles.texto}>Saídas registradas, com valor e forma de pagamento.</Text>
    </View>
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
