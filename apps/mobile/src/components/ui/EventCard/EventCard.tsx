import { Pressable, StyleSheet, Text, View } from 'react-native'

import { FavoriteButton } from '~/components/ui/FavoriteButton'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface EventCardParams {
  id: number
  title: string
  category: string
  venue: string
  date: string
  day: string
  month: string
}

export interface EventCardProps extends EventCardParams {
  favorite: boolean
  onPress: () => void
  onFavoriteToggle: () => void
}

export function EventCard({
  title,
  category,
  venue,
  date,
  day,
  month,
  favorite,
  onPress,
  onFavoriteToggle,
}: EventCardProps) {
  return (
    <View style={STYLES.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={i18n.t('event.label', {
          category,
          title,
          venue,
          date,
        })}
        accessibilityHint={i18n.t('event.open_hint')}
        style={({ pressed }) => {
          return [STYLES.content, pressed && STYLES.pressed]
        }}
        onPress={onPress}>
        <View style={STYLES.badge}>
          <Text style={STYLES.month}>{month}</Text>
          <Text style={STYLES.day}>{day}</Text>
        </View>

        <Text style={STYLES.category}>{category}</Text>
        <Text style={STYLES.title}>{title}</Text>
        <Text style={STYLES.venue}>{venue}</Text>
        <Text style={STYLES.date}>{date}</Text>
      </Pressable>

      <View style={STYLES.favorite}>
        <FavoriteButton
          title={title}
          selected={favorite}
          onToggle={onFavoriteToggle}
        />
      </View>
    </View>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },

  card: { borderRadius: 20, backgroundColor: COLORS.surface },

  content: { padding: 20, borderRadius: 20 },

  favorite: { position: 'absolute', top: 28, right: 20 },

  badge: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    minWidth: 56,
    minHeight: 60,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },

  month: {
    color: COLORS.accent,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  day: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },

  category: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },

  title: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.4,
  },

  venue: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 4 },

  date: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 16 },
})
