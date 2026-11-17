import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FavoriteButton } from '~/components/ui/FavoriteButton'
import { Icon } from '~/components/ui/Icon'

import { useFavoritesContext } from '~/contexts/FavoritesContext'

import { getEventPage } from '~/data/get-event-page'
import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface EventPageData {
  id: number
  title: string
  category: string
  description: string
  venue: string
  address: string
  date: string
  price: string
}

export default function EventPage() {
  const { id } = useLocalSearchParams<'/events/[id]'>()
  const router = useRouter()
  const { favoriteIds, toggleFavorite } = useFavoritesContext()

  const event = getEventPage(Number(id))

  function onClose() {
    router.dismiss()
  }

  const closeButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={i18n.t('event.close')}
      style={({ pressed }) => {
        return [STYLES.close, pressed && STYLES.pressed]
      }}
      onPress={onClose}>
      <Icon name="close" color={COLORS.text} size={16} />
    </Pressable>
  )

  // a redirect would replace the sheet with a second tabs screen, so the sheet stays open
  if (!event) {
    return (
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={STYLES.screen}
        onAccessibilityEscape={onClose}>
        <View style={STYLES.toolbar}>{closeButton}</View>
        <View style={STYLES.content}>
          <Text accessibilityRole="header" style={STYLES.title}>
            {i18n.t('event.not_found.title')}
          </Text>
          <Text style={STYLES.description}>
            {i18n.t('event.not_found.description')}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const details = [
    { label: i18n.t('event.date'), value: event.date },
    { label: i18n.t('event.venue'), value: `${event.venue}\n${event.address}` },
    { label: i18n.t('event.price'), value: event.price },
  ]

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={STYLES.screen}
      onAccessibilityEscape={onClose}>
      <View style={STYLES.toolbar}>
        <FavoriteButton
          title={event.title}
          selected={favoriteIds.includes(event.id)}
          onToggle={() => toggleFavorite(event.id)}
        />
        {closeButton}
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={STYLES.content}>
        <Text style={STYLES.category}>{event.category}</Text>
        <Text accessibilityRole="header" style={STYLES.title}>
          {event.title}
        </Text>
        <Text style={STYLES.description}>{event.description}</Text>

        <View style={STYLES.details}>
          {details.map(({ label, value }) => {
            return (
              <View key={label} style={STYLES.detail}>
                <Text style={STYLES.label}>{label}</Text>
                <Text style={STYLES.value}>{value}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  toolbar: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },

  close: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: COLORS.control,
  },

  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  category: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  title: {
    color: COLORS.text,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '700',
    letterSpacing: -0.8,
  },

  description: {
    marginTop: 20,
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 26,
  },

  details: {
    marginTop: 28,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    gap: 24,
  },

  detail: { gap: 6 },

  label: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },

  value: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
})
