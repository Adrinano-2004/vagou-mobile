import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import LogoVagou from '../../components/LogoVagou';
import { COR_PRINCIPAL, COR_TEXTO_HEADER } from '../../tema';

const LADO_DO_MENU = 'left';
const ALINHAMENTO_TITULO = 'center';
const TITULO_APP = 'Vagou';
const MOSTRAR_LOGO = true;
const COR_LOGO = 'branca';

const ICONE_PATIO = 'car-outline';
const ICONE_TARIFAS = 'pricetags-outline';
const ICONE_SOBRE = 'information-circle-outline';

export default function LayoutDrawer() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: LADO_DO_MENU,
        headerStyle: { backgroundColor: COR_PRINCIPAL },
        headerTintColor: COR_TEXTO_HEADER,
        headerTitleAlign: ALINHAMENTO_TITULO,
        drawerActiveTintColor: COR_PRINCIPAL,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: TITULO_APP,

          headerTitle: MOSTRAR_LOGO ? () => <LogoVagou cor={COR_LOGO} /> : TITULO_APP,
          drawerLabel: 'Pátio',
          drawerIcon: ({ color, size }) => <Ionicons name={ICONE_PATIO} size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="tarifas"
        options={{
          title: 'Tarifas',
          drawerIcon: ({ color, size }) => <Ionicons name={ICONE_TARIFAS} size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          drawerIcon: ({ color, size }) => <Ionicons name={ICONE_SOBRE} size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
