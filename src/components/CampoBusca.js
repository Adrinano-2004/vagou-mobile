import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR_CARD, COR_APOIO, COR_LINHA } from '../tema';

// campo de pesquisa com lupa e botao de limpar
// usado no Patio, no Historico e na lista de marcas/modelos
export default function CampoBusca({ valor, onChange, placeholder = 'Pesquisar' }) {
  return (
    <View style={styles.caixa}>
      <Ionicons name="search" size={20} color={COR_APOIO} />
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COR_APOIO}
        autoCorrect={false}
      />
      {valor !== '' && (
        <Pressable onPress={() => onChange('')} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={COR_APOIO} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
