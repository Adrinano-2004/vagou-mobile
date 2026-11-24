import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatio } from '../../PatioContext';
import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import { COR_FUNDO, COR_CARD, COR_TEXTO, COR_APOIO, COR_LINHA, COR_LIVRE, COR_OCUPADO } from '../../tema';

// campos de cada tarifa que aparecem na tela (chave no objeto da tarifa -> titulo)
const CAMPOS = [
  { chave: 'toleranciaMin', rotulo: 'Tolerância (min)' },
  { chave: 'primeiraHora', rotulo: '1ª hora (R$)' },
  { chave: 'horaAdicional', rotulo: 'Hora adicional (R$)' },
  { chave: 'meiaDiaria', rotulo: 'Meia diária (R$)' },
  { chave: 'diaria', rotulo: 'Diária (R$)' },
];

// transforma as tarifas em texto pros campos (o TextInput so trabalha com texto)
function paraTexto(tarifas) {
  return tarifas.map((tarifa) => {
    const copia = { ...tarifa };
    CAMPOS.forEach((campo) => {
      copia[campo.chave] = String(tarifa[campo.chave]).replace('.', ',');
    });
    return copia;
  });
}

// '12,50' -> 12.5  |  'abc' -> NaN
function paraNumero(texto) {
  return Number(String(texto).replace(',', '.'));
}

// tabela de precos e total de vagas (editaveis e salvos no aparelho)
export default function Tarifas() {
  const { tarifas, vagas, pix, salvarTarifas } = usePatio();
  const [rascunho, setRascunho] = useState(paraTexto(tarifas));
  const [vagasTexto, setVagasTexto] = useState(String(vagas));
  const [pixRascunho, setPixRascunho] = useState(pix);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // se as tarifas mudarem por fora (ex: "apagar dados" no Sobre), atualiza os campos
  useEffect(() => {
    setRascunho(paraTexto(tarifas));
    setVagasTexto(String(vagas));
    setPixRascunho(pix);
  }, [tarifas, vagas, pix]);

  function alterar(id, chave, texto) {
    setMensagem('');
    setRascunho(rascunho.map((tarifa) => (tarifa.id === id ? { ...tarifa, [chave]: texto } : tarifa)));
  }

  function alterarPix(chave, texto) {
    setMensagem('');
    setPixRascunho({ ...pixRascunho, [chave]: texto });
  }

  function salvar() {
    setMensagem('');
    setErro('');

    const novasVagas = paraNumero(vagasTexto);
    if (!Number.isInteger(novasVagas) || novasVagas < 1) {
      setErro('O total de vagas precisa ser um número inteiro maior que zero.');
      return;
    }

    const novasTarifas = [];
    for (const tarifa of rascunho) {
      const nova = { ...tarifa };
      for (const campo of CAMPOS) {
        const numero = paraNumero(tarifa[campo.chave]);
        if (tarifa[campo.chave] === '' || isNaN(numero) || numero < 0) {
          setErro(`${tarifa.nome}: "${campo.rotulo}" precisa ser um número.`);
          return;
        }
        nova[campo.chave] = numero;
      }
      novasTarifas.push(nova);
    }

    const novoPix = {
      chave: pixRascunho.chave.trim(),
      nome: pixRascunho.nome.trim(),
      cidade: pixRascunho.cidade.trim(),
    };

    salvarTarifas(novasTarifas, novasVagas, novoPix);
    setMensagem('✓ Tarifas salvas no aparelho!');
  }

  return (
    <SafeAreaView style={styles.tela} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.explicacao}>
          Cada hora iniciada conta como hora cheia. Até 12h o valor não passa da meia diária, e até 24h não passa da
          diária.
        </Text>

        <View style={styles.card}>
          <Campo
            rotulo="Total de vagas"
            value={vagasTexto}
            onChangeText={(texto) => {
              setMensagem('');
              setVagasTexto(texto);
            }}
            keyboardType="number-pad"
          />
        </View>

        {rascunho.map((tarifa) => (
          <View key={tarifa.id} style={styles.card}>
            <Text style={styles.nome}>{tarifa.nome}</Text>
            <View style={styles.grade}>
              {CAMPOS.map((campo) => (
                <Campo
                  key={campo.chave}
                  rotulo={campo.rotulo}
                  value={tarifa[campo.chave]}
                  onChangeText={(texto) => alterar(tarifa.id, campo.chave, texto)}
                  keyboardType="decimal-pad"
                  style={styles.metade}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.nome}>Dados do PIX</Text>
          <Text style={styles.explicacao}>Usados para gerar o QR code na saída. Sem a chave, o QR não aparece.</Text>
          <Campo
            rotulo="Chave PIX"
            value={pixRascunho.chave}
            onChangeText={(texto) => alterarPix('chave', texto)}
            placeholder="CPF, CNPJ, e-mail, celular ou chave aleatória"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Campo
            rotulo="Nome de quem recebe"
            value={pixRascunho.nome}
            onChangeText={(texto) => alterarPix('nome', texto)}
            maxLength={25}
          />
          <Campo
            rotulo="Cidade"
            value={pixRascunho.cidade}
            onChangeText={(texto) => alterarPix('cidade', texto)}
            maxLength={15}
          />
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

        <Botao titulo="Salvar tarifas" icone="save-outline" onPress={salvar} />
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
  explicacao: {
    color: COR_APOIO,
    marginBottom: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COR_CARD,
    borderWidth: 1,
    borderColor: COR_LINHA,
    borderRadius: 12,
    padding: 14,
    paddingBottom: 0,
    marginBottom: 14,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COR_TEXTO,
    marginBottom: 10,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metade: {
    width: '48%',
  },
  erro: {
    color: COR_OCUPADO,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sucesso: {
    color: COR_LIVRE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
