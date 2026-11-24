import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR_PRINCIPAL } from '../tema';

// botao padrao do app
// contorno = true deixa o botao so com a borda (pra acoes secundarias)
export default function Botao({ titulo, onPress, icone, cor = COR_PRINCIPAL, contorno = false, desabilitado = false }) {
  const corTexto = contorno ? cor : 'white';

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: contorno ? 'transparent' : cor, borderColor: cor },
        pressed && styles.pressionado,
        desabilitado && styles.desabilitado,
      ]}
    >
      {icone && <Ionicons name={icone} size={20} color={corTexto} />}
      <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 10,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressionado: {
    opacity: 0.7,
  },
  desabilitado: {
    opacity: 0.4,
  },
});
