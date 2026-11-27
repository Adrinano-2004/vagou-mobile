import { Image } from 'react-native';

const IMAGENS = {
  branca: require('../../assets/logo-branca.png'),
  grafite: require('../../assets/logo-grafite.png'),
};

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
