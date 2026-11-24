import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CampoBusca from './CampoBusca';
import Estado from './Estado';
import Botao from './Botao';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA } from '../tema';

// campo que abre uma janela com uma lista pesquisavel pra escolher um item
// usado na tela Entrada duas vezes: pra marca e pra modelo (os dois vem da API FIPE)
export default function SeletorLista({
  rotulo,
  itens,
  selecionado,
  onSelecionar,
  carregando,
  erro,
  onTentarNovamente,
  desabilitado = false,
  placeholder = 'Toque para escolher',
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState('');

  // filtra pelo nome, sem diferenciar maiuscula de minuscula
  const texto = busca.trim().toLowerCase();
  const itensFiltrados = itens.filter((item) => item.nome.toLowerCase().includes(texto));

  function fechar() {
    setAberto(false);
    setBusca('');
  }

  function escolher(item) {
    onSelecionar(item);
    fechar();
  }

  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <Pressable
        style={[styles.campo, desabilitado && styles.campoDesabilitado]}
        onPress={() => setAberto(true)}
        disabled={desabilitado}
      >
        <Text style={[styles.textoCampo, !selecionado && styles.placeholder]} numberOfLines={1}>
          {selecionado ? selecionado.nome : placeholder}
        </Text>
        {selecionado && !desabilitado ? (
          <Pressable onPress={() => onSelecionar(null)} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color={COR_APOIO} />
          </Pressable>
        ) : (
          <Ionicons name="chevron-down" size={20} color={COR_APOIO} />
        )}
      </Pressable>

      <Modal visible={aberto} animationType="slide" onRequestClose={fechar}>
        <SafeAreaView style={styles.janela}>
          <View style={styles.topo}>
            <Text style={styles.titulo}>{rotulo}</Text>
            <Pressable onPress={fechar} hitSlop={10}>
              <Ionicons name="close" size={28} color={COR_TEXTO} />
            </Pressable>
          </View>

          <CampoBusca valor={busca} onChange={setBusca} placeholder={`Pesquisar ${rotulo.toLowerCase()}`} />

          {/* a lista ocupa o espaco do meio, assim o botao Fechar fica sempre embaixo */}
          <View style={styles.meio}>
            {carregando || erro ? (
              <Estado carregando={carregando} erro={erro} onTentarNovamente={onTentarNovamente} />
            ) : (
              <FlatList
                data={itensFiltrados}
                keyExtractor={(item) => item.codigo}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                  <Text style={styles.total}>
                    {itensFiltrados.length} {itensFiltrados.length === 1 ? 'encontrado' : 'encontrados'}
                  </Text>
                }
                ListEmptyComponent={<Estado mensagem="Nada encontrado com esse nome." icone="search" />}
                renderItem={({ item }) => (
                  <Pressable style={styles.item} onPress={() => escolher(item)}>
                    <Text style={[styles.textoItem, selecionado?.codigo === item.codigo && styles.itemSelecionado]}>
                      {item.nome}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </View>

          <Botao titulo="Fechar" contorno onPress={fechar} />
        </SafeAreaView>
      </Modal>
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
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  campoDesabilitado: {
    opacity: 0.5,
  },
  textoCampo: {
    flex: 1,
    fontSize: 16,
    color: COR_TEXTO,
  },
  placeholder: {
    color: COR_APOIO,
  },
  janela: {
    flex: 1,
    backgroundColor: COR_FUNDO,
    padding: 16,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  meio: {
    flex: 1,
  },
  total: {
    color: COR_APOIO,
    marginBottom: 6,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COR_LINHA,
  },
  textoItem: {
    fontSize: 16,
  },
  itemSelecionado: {
    fontWeight: 'bold',
  },
});
