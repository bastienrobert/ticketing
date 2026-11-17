import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { FavoritesProvider } from '~/contexts/FavoritesContext'

import { COLORS } from '~/styles/theme'

export const unstable_settings = { anchor: '(tabs)' }

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="events/[id]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.75, 1],
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </FavoritesProvider>
  )
}
