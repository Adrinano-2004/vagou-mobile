import { View, Text, StyleSheet } from 'react-native';
import { COR_FUNDO, COR_APOIO } from '../../../tema';

// TODO: conteúdo real (etapa 7)
export default function Painel() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Painel</Text>
      <Text style={styles.texto}>Vagas ocupadas, valor recebido hoje e últimas movimentações.</Text>
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
