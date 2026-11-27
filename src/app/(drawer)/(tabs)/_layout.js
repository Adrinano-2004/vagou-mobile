import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COR_PRINCIPAL, COR_APOIO } from '../../../tema';

const ICONE_ABA_PAINEL = 'speedometer-outline';
const ICONE_ABA_ENTRADA = 'add-circle-outline';
const ICONE_ABA_PATIO = 'car-outline';
const ICONE_ABA_HISTORICO = 'time-outline';

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
