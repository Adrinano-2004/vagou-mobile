import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import Botao from './Botao';
import { gerarPix } from '../pix';
import { formatarMoeda } from '../calculo';
import { COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_LIVRE } from '../tema';

const TAMANHO_QR = 200;
const COR_QR = 'black';

export default function QrPix({ pix, valor, identificador }) {
  const [copiado, setCopiado] = useState(false);

  if (!pix.chave) {
    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>Pague com PIX</Text>
        <Text style={styles.apoio}>Cadastre a chave PIX do estacionamento para gerar o QR code.</Text>
        <Botao titulo="Cadastrar chave PIX" icone="key-outline" contorno onPress={() => router.push('/tarifas')} />
      </View>
    );
  }

  if (valor <= 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>Pague com PIX</Text>
        <Text style={styles.apoio}>Não há valor a cobrar.</Text>
      </View>
    );
  }

  const codigo = gerarPix({ chave: pix.chave, nome: pix.nome, cidade: pix.cidade, valor, identificador });

  async function copiar() {
    await Clipboard.setStringAsync(codigo);
    setCopiado(true);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Pague com PIX</Text>
      <Text style={styles.valor}>{formatarMoeda(valor)}</Text>

      <View style={styles.moldura}>
        <QRCode value={codigo} size={TAMANHO_QR} color={COR_QR} backgroundColor="white" />
      </View>

      <Text style={styles.apoio}>
        {pix.nome} · {pix.cidade}
      </Text>

      <Botao
        titulo={copiado ? '✓ Código copiado!' : 'Copiar código PIX'}
        icone="copy-outline"
        contorno
        cor={copiado ? COR_LIVRE : COR_TEXTO}
        onPress={copiar}
      />
      <Text style={styles.dica}>Depois que o cliente pagar, toque em Registrar saída.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginVertical: 8,
  },
  moldura: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COR_LINHA,
    marginBottom: 10,
  },
  apoio: {
    color: COR_APOIO,
    textAlign: 'center',
    marginTop: 4,
  },
  dica: {
    color: COR_APOIO,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
