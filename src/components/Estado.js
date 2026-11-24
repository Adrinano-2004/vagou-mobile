import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from './Botao';
import { COR_PRINCIPAL, COR_APOIO, COR_OCUPADO } from '../tema';

// mostra o feedback visual de uma tela ou lista:
// - carregando: rodinha girando
// - erro: mensagem em vermelho + botao "Tentar de novo"
// - mensagem: aviso de lista vazia (com icone)
// children: algo a mais embaixo (ex: um botao)
export default function Estado({ carregando, erro, onTentarNovamente, mensagem, icone = 'file-tray-outline', children }) {
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={COR_PRINCIPAL} />
        <Text style={styles.texto}>{mensagem || 'Carregando...'}</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Ionicons name="cloud-offline-outline" size={44} color={COR_OCUPADO} />
        <Text style={[styles.texto, styles.erro]}>{erro}</Text>
        {onTentarNovamente && <Botao titulo="Tentar de novo" icone="refresh" contorno onPress={onTentarNovamente} />}
      </View>
    );
  }

  return (
    <View style={styles.centro}>
      <Ionicons name={icone} size={44} color={COR_APOIO} />
      <Text style={styles.texto}>{mensagem}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  texto: {
    color: COR_APOIO,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  erro: {
    color: COR_OCUPADO,
  },
});
