import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COR_CARD, COR_APOIO, COR_LINHA } from '../tema';

// campo de formulario com titulo em cima
// o resto das props (value, onChangeText, keyboardType...) vai direto pro TextInput
export default function Campo({ rotulo, style, ...props }) {
  return (
    <View style={[styles.grupo, style]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput style={styles.input} placeholderTextColor={COR_APOIO} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
});
