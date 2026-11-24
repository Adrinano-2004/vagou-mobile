import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePatio } from '../../PatioContext';
import Botao from '../../components/Botao';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_PRINCIPAL, COR_OCUPADO, COR_LIVRE } from '../../tema';

// ===== textos da tela (mudar aqui) =====
const DUPLA = 'Adriano e Arthur Villela';
const PASSOS = [
  'Na aba Entrada, digite a placa, escolha o tipo, a marca e o modelo.',
  'O veículo aparece na aba Pátio, com o tempo e o valor correndo.',
  'Toque no veículo, escolha a forma de pagamento e registre a saída.',
  'Acompanhe o dia no Painel e as saídas no Histórico.',
];
const TECNOLOGIAS = [
  'React Native com Expo',
  'Expo Router: Stack, Drawer e Tabs',
  'API da Tabela FIPE com fetch',
  'AsyncStorage para salvar no aparelho',
  'Context, useState e useEffect',
];

export default function Sobre() {
  const { apagarTudo } = usePatio();
  const [confirmar, setConfirmar] = useState(false);
  const [apagado, setApagado] = useState(false);

  // pede 2 toques pra apagar
  function apagar() {
    if (!confirmar) {
      setConfirmar(true);
      return;
    }
    apagarTudo();
    setConfirmar(false);
    setApagado(true);
  }

  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Ionicons name="car-sport" size={40} color="white" />
          </View>
          <Text style={styles.nome}>Vagou</Text>
          <Text style={styles.slogan}>Controle de pátio para estacionamentos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.titulo}>O que é</Text>
          <Text style={styles.texto}>
            App para o operador registrar a entrada e a saída dos veículos pela placa. Ele mostra quem está no pátio e
            calcula sozinho o valor a pagar, a partir da tabela de preços.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.titulo}>Como usar</Text>
          {PASSOS.map((passo, indice) => (
            <Text key={passo} style={styles.texto}>
              {indice + 1}. {passo}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.titulo}>Tecnologias</Text>
          {TECNOLOGIAS.map((item) => (
            <Text key={item} style={styles.texto}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.titulo}>Dupla</Text>
          <Text style={styles.texto}>{DUPLA}</Text>
          <Text style={styles.apoio}>Trabalho final de Desenvolvimento Móvel</Text>
        </View>

        {apagado && <Text style={styles.sucesso}>✓ Dados apagados. O app voltou ao início.</Text>}
        <Botao
          titulo={confirmar ? 'Toque de novo para apagar tudo' : 'Apagar todos os dados'}
          icone="trash-outline"
          cor={COR_OCUPADO}
          contorno={!confirmar}
          onPress={apagar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR_FUNDO,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 30,
  },
  marca: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: COR_PRINCIPAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginTop: 10,
  },
  slogan: {
    color: COR_APOIO,
    marginTop: 2,
  },
  card: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  texto: {
    fontSize: 15,
    color: COR_TEXTO,
    lineHeight: 22,
  },
  apoio: {
    color: COR_APOIO,
    marginTop: 2,
  },
  sucesso: {
    color: COR_LIVRE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
