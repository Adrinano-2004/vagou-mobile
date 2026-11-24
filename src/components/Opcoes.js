import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COR_PRINCIPAL, COR_CARD, COR_TEXTO, COR_LINHA } from '../tema';

// linha de botoes pra escolher UMA opcao (tipo de veiculo, cor, forma de pagamento, filtro)
// opcoes: [{ valor: 'pix', rotulo: 'PIX' }, ...]
export default function Opcoes({ opcoes, selecionado, onSelecionar }) {
  return (
    <View style={styles.linha}>
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === selecionado;
        return (
          <Pressable
            key={opcao.valor}
            style={[styles.opcao, ativo && styles.opcaoAtiva]}
            onPress={() => onSelecionar(opcao.valor)}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{opcao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  opcao: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COR_LINHA,
    backgroundColor: COR_CARD,
  },
  opcaoAtiva: {
    backgroundColor: COR_PRINCIPAL,
    borderColor: COR_PRINCIPAL,
  },
  texto: {
    color: COR_TEXTO,
    fontWeight: '600',
  },
  textoAtivo: {
    color: 'white',
  },
});
