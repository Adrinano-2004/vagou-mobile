import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COR_PRINCIPAL, COR_TEXTO_HEADER } from '../../tema';

// ===== configuracoes do menu (mudar aqui) =====
const LADO_DO_MENU = 'left';                       // 'left' (esquerda) ou 'right' (direita)
const ALINHAMENTO_TITULO = 'center';               // 'center' ou 'left'
const TITULO_APP = 'Vagou';                        // titulo do cabecalho nas abas
// icones (nomes em https://icons.expo.fyi, biblioteca Ionicons)
const ICONE_PATIO = 'car-outline';                 // ex: 'car', 'car-sport-outline'
const ICONE_TARIFAS = 'pricetags-outline';         // ex: 'cash-outline', 'pricetag'
const ICONE_SOBRE = 'information-circle-outline';  // ex: 'help-circle-outline'
// =============================================

// menu lateral (Drawer): Patio (com as abas dentro), Tarifas e Sobre
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
