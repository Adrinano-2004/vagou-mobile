import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { COR_FUNDO, COR_APOIO, COR_PRINCIPAL } from '../../../tema';

// TODO: conteúdo real (etapa 5)
export default function Patio() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Pátio</Text>
      <Text style={styles.texto}>Veículos estacionados agora, com tempo de permanência e busca por placa.</Text>

      {/* link provisorio so pra testar o Stack: abre a rota ticket/[id] */}
      <Link href="/ticket/1" style={styles.link}>
        Abrir ticket de teste
      </Link>
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
  link: {
    marginTop: 20,
    color: COR_PRINCIPAL,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
