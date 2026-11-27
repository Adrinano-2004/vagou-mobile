import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatioProvider } from '../PatioContext';
import { COR_PRINCIPAL, COR_TEXTO_HEADER } from '../tema';

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
