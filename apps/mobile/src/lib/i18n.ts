import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import fr from '~/data/messages/fr.json'

export const i18n = new I18n(
  { fr },
  {
    locale: getLocales().at(0)?.languageCode ?? 'fr',
    defaultLocale: 'fr',
    enableFallback: true,
  },
)
