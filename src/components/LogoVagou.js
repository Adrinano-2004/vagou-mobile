import { Image } from 'react-native';

// logo oficial do Vagou (a mesma do sistema original), em duas versoes:
// - 'branca': pra fundo escuro (cabecalho preto)
// - 'grafite': pra fundo claro (tela Sobre)
const IMAGENS = {
  branca: require('../../assets/logo-branca.png'),
  grafite: require('../../assets/logo-grafite.png'),
};

// a imagem e 2,975 vezes mais larga do que alta: a largura sai da altura
const PROPORCAO = 2.975;

export default function LogoVagou({ cor = 'branca', altura = 26 }) {
  return (
    <Image
      source={IMAGENS[cor]}
      style={{ height: altura, width: altura * PROPORCAO }}
      resizeMode="contain"
      accessibilityLabel="Vagou"
    />
  );
}
