import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PatioProvider } from '../PatioContext';
import { COR_PRINCIPAL, COR_TEXTO_HEADER } from '../tema';

// layout raiz: um Stack por fora de tudo
// o Drawer (com as abas dentro) e uma tela do Stack, e o detalhe do ticket abre por cima dele
// o PatioProvider fica por fora pra todas as telas acessarem os mesmos dados
export default function LayoutRaiz() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PatioProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COR_PRINCIPAL },
            headerTintColor: COR_TEXTO_HEADER,
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="ticket/[id]" options={{ title: 'Ticket' }} />
        </Stack>
      </PatioProvider>
    </GestureHandlerRootView>
  );
}
