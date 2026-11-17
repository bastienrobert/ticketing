import { useRouter } from 'expo-router'

import { Message } from '~/components/views/Message'

import { i18n } from '~/lib/i18n'

export default function NotFoundPage() {
  const router = useRouter()

  // the catalogue is anchored under every deep link, so this returns to it
  function onBrowsePress() {
    router.dismissTo('/')
  }

  return (
    <Message
      title={i18n.t('navigation.not_found.title')}
      description={i18n.t('navigation.not_found.description')}
      button={{
        label: i18n.t('navigation.not_found.button'),
        onPress: onBrowsePress,
      }}
    />
  )
}
