import { expoClient } from '@better-auth/expo/client'
import { createAuthClient } from 'better-auth/react'
import * as SecureStore from 'expo-secure-store'

import { API_URL } from '~/const'

// the Expo plugin keeps the session cookie in SecureStore (Keychain / Keystore)
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'ticketing',
      storagePrefix: 'ticketing',
      storage: SecureStore,
    }),
  ],
})
