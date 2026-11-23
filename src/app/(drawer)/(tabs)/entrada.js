import { View, Text, StyleSheet } from 'react-native';
import { COR_FUNDO, COR_APOIO } from '../../../tema';

// TODO: conteúdo real (etapa 5)
export default function Entrada() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Nova entrada</Text>
      <Text style={styles.texto}>Placa, tipo, marca e modelo (API FIPE) e cor do veículo.</Text>
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
