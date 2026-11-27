import { View, Text, StyleSheet } from 'react-native';
import { COR_PLACA } from '../tema';

export default function Placa({ placa, grande = false }) {
  const texto = /^[A-Z]{3}[0-9]{4}$/.test(placa) ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa;

  return (
    <View style={[styles.placa, grande && styles.placaGrande]}>
      <View style={styles.faixa}>
        <Text style={[styles.brasil, grande && styles.brasilGrande]}>BRASIL</Text>
      </View>
      <Text style={[styles.texto, grande && styles.textoGrande]}>{texto || '-------'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placa: {
    width: 96,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 6,
    backgroundColor: 'white',
    overflow: 'hidden',
    alignItems: 'center',
  },
  placaGrande: {
    width: 220,
    borderWidth: 3,
    borderRadius: 10,
  },
  faixa: {
    alignSelf: 'stretch',
    backgroundColor: COR_PLACA,
    alignItems: 'center',
  },
  brasil: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  brasilGrande: {
    fontSize: 12,
    paddingVertical: 2,
  },
  texto: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingVertical: 2,
  },
  textoGrande: {
    fontSize: 40,
    letterSpacing: 3,
    paddingVertical: 6,
  },
});
