import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { usePatio } from '../../../PatioContext';
import { buscarMarcas, buscarModelos } from '../../../api';
import { limparPlaca, placaValida } from '../../../calculo';
import Campo from '../../../components/Campo';
import Opcoes from '../../../components/Opcoes';
import SeletorLista from '../../../components/SeletorLista';
import Placa from '../../../components/Placa';
import Botao from '../../../components/Botao';
import { COR_FUNDO, COR_APOIO, COR_OCUPADO } from '../../../tema';

// ===== configuracoes da entrada (mudar aqui) =====
const TIPO_PADRAO = 'carro';   // tipo que ja vem marcado: 'carro', 'moto' ou 'utilitario'
const CORES_VEICULO = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Outra'];

export default function Entrada() {
  const { tarifas, noPatio, vagas, registrarEntrada } = usePatio();

  // dados do formulario
  const [placa, setPlaca] = useState('');
  const [tarifaId, setTarifaId] = useState(TIPO_PADRAO);
  const [marca, setMarca] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [cor, setCor] = useState('');
  const [erro, setErro] = useState('');

  // dados que vem da API
  const [marcas, setMarcas] = useState([]);
  const [carregandoMarcas, setCarregandoMarcas] = useState(false);
  const [erroMarcas, setErroMarcas] = useState('');
  const [tentativaMarcas, setTentativaMarcas] = useState(0);

  const [modelos, setModelos] = useState([]);
  const [carregandoModelos, setCarregandoModelos] = useState(false);
  const [erroModelos, setErroModelos] = useState('');
  const [tentativaModelos, setTentativaModelos] = useState(0);

  const tarifa = tarifas.find((item) => item.id === tarifaId) || tarifas[0];
  const tipoFipe = tarifa.tipoFipe;
  const livres = vagas - noPatio.length;

  // busca as marcas na API sempre que o tipo de veiculo muda (carro, moto...)
  useEffect(() => {
    let ativo = true; // evita mostrar a resposta de uma busca antiga se o tipo mudar no meio

    async function carregar() {
      setCarregandoMarcas(true);
      setErroMarcas('');
      try {
        const lista = await buscarMarcas(tipoFipe);
        if (ativo) setMarcas(lista);
      } catch (e) {
        if (ativo) setErroMarcas(e.message);
      } finally {
        if (ativo) setCarregandoMarcas(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [tipoFipe, tentativaMarcas]);

  // busca os modelos na API sempre que a marca escolhida muda
  useEffect(() => {
    if (!marca) {
      setModelos([]);
      return;
    }
    let ativo = true;

    async function carregar() {
      setCarregandoModelos(true);
      setErroModelos('');
      try {
        const lista = await buscarModelos(tipoFipe, marca.codigo);
        if (ativo) setModelos(lista);
      } catch (e) {
        if (ativo) setErroModelos(e.message);
      } finally {
        if (ativo) setCarregandoModelos(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [marca, tipoFipe, tentativaModelos]);

  function escolherTipo(id) {
    setTarifaId(id);
    setMarca(null); // marcas de carro e de moto sao diferentes, entao limpa
    setModelo(null);
  }

  function escolherMarca(item) {
    setMarca(item);
    setModelo(null);
  }

  function limparFormulario() {
    setPlaca('');
    setMarca(null);
    setModelo(null);
    setCor('');
    setErro('');
  }

  function registrar() {
    setErro('');
    const placaLimpa = limparPlaca(placa);

    if (!placaValida(placaLimpa)) {
      setErro('Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC1234.');
      return;
    }

    try {
      const ticket = registrarEntrada({
        placa: placaLimpa,
        tarifaId,
        marca: marca ? marca.nome : '',
        modelo: modelo ? modelo.nome : '',
        cor,
      });
      limparFormulario();
      // abre o ticket que acabou de ser criado (nova=1 mostra o aviso de sucesso)
      router.push({ pathname: '/ticket/[id]', params: { id: ticket.id, nova: '1' } });
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={[styles.vagas, livres <= 0 && { color: COR_OCUPADO }]}>
        {livres > 0 ? `${livres} vagas livres de ${vagas}` : 'Pátio lotado'}
      </Text>

      <View style={styles.previa}>
        <Placa placa={limparPlaca(placa)} grande />
      </View>

      <Campo
        rotulo="Placa"
        value={placa}
        onChangeText={(texto) => setPlaca(limparPlaca(texto).slice(0, 7))}
        placeholder="ABC1D23"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={8}
      />

      <Text style={styles.rotulo}>Tipo de veículo</Text>
      <Opcoes
        opcoes={tarifas.map((item) => ({ valor: item.id, rotulo: item.nome }))}
        selecionado={tarifaId}
        onSelecionar={escolherTipo}
      />

      <SeletorLista
        rotulo="Marca"
        itens={marcas}
        selecionado={marca}
        onSelecionar={escolherMarca}
        carregando={carregandoMarcas}
        erro={erroMarcas}
        onTentarNovamente={() => setTentativaMarcas(tentativaMarcas + 1)}
        placeholder={carregandoMarcas ? 'Carregando marcas...' : 'Toque para escolher (opcional)'}
      />

      <SeletorLista
        rotulo="Modelo"
        itens={modelos}
        selecionado={modelo}
        onSelecionar={setModelo}
        carregando={carregandoModelos}
        erro={erroModelos}
        onTentarNovamente={() => setTentativaModelos(tentativaModelos + 1)}
        desabilitado={!marca}
        placeholder={marca ? 'Toque para escolher (opcional)' : 'Escolha a marca primeiro'}
      />

      <Text style={styles.rotulo}>Cor</Text>
      <Opcoes
        opcoes={CORES_VEICULO.map((nome) => ({ valor: nome, rotulo: nome }))}
        selecionado={cor}
        onSelecionar={setCor}
      />

      {erroMarcas !== '' && (
        <Text style={styles.aviso}>Sem a API, dá pra registrar a entrada só com a placa e o tipo.</Text>
      )}
      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <Botao titulo="Registrar entrada" icone="enter-outline" onPress={registrar} desabilitado={livres <= 0} />
      <Botao titulo="Limpar" contorno onPress={limparFormulario} />
    </ScrollView>
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
  vagas: {
    textAlign: 'center',
    color: COR_APOIO,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  previa: {
    alignItems: 'center',
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COR_APOIO,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  aviso: {
    color: COR_APOIO,
    textAlign: 'center',
    marginBottom: 6,
  },
  erro: {
    color: COR_OCUPADO,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
});
