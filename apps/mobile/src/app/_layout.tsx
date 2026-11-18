import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { FavoritesProvider } from '~/contexts/FavoritesContext'

import migrations from '~/db/migrations/migrations'
import { db } from '~/lib/db'

import { COLORS } from '~/styles/theme'

export const unstable_settings = { anchor: '(tabs)' }

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations)

  if (error) throw error
  if (!success) return null

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
