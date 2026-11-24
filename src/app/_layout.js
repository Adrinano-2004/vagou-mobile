import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatioProvider } from '../PatioContext';
import { COR_PRINCIPAL, COR_TEXTO_HEADER } from '../tema';

// layout raiz: o primeiro arquivo que o Expo Router abre
// - GestureHandlerRootView: necessario pros gestos do Drawer (arrastar o menu)
// - SafeAreaProvider: mede as areas seguras do celular (notch, barrinha de baixo)
//   pros SafeAreaView das telas saberem quanto espaco deixar
// - PatioProvider: os dados do estacionamento, compartilhados com todas as telas
// - Stack: o Drawer (com as abas dentro) e uma tela do Stack, e o ticket abre por cima dele
export default function LayoutRaiz() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
