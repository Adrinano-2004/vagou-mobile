import { View, Text, StyleSheet } from 'react-native';

// tela provisoria so pra testar o expo router (vai ser trocada na etapa 3)
export default function Inicio() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Vagou</Text>
      <Text>Controle de pátio para estacionamentos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
