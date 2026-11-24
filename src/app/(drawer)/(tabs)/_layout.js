import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COR_PRINCIPAL, COR_APOIO } from '../../../tema';

// ===== configuracoes das abas (mudar aqui) =====
// icones (nomes em https://icons.expo.fyi, biblioteca Ionicons)
const ICONE_ABA_PAINEL = 'speedometer-outline';     // ex: 'grid-outline', 'stats-chart'
const ICONE_ABA_ENTRADA = 'add-circle-outline';     // ex: 'enter-outline', 'add'
const ICONE_ABA_PATIO = 'car-outline';              // ex: 'car', 'list-outline'
const ICONE_ABA_HISTORICO = 'time-outline';         // ex: 'receipt-outline', 'calendar'
// =============================================

// abas de baixo (Bottom Tabs): Painel, Entrada, Patio e Historico
// o cabecalho fica com o Drawer, por isso headerShown: false aqui
export default function LayoutAbas() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COR_PRINCIPAL,
        tabBarInactiveTintColor: COR_APOIO,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Painel',
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONE_ABA_PAINEL} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="entrada"
        options={{
          tabBarLabel: 'Entrada',
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONE_ABA_ENTRADA} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patio"
        options={{
          tabBarLabel: 'Pátio',
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONE_ABA_PATIO} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONE_ABA_HISTORICO} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
