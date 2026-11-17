import { StyleSheet, View } from 'react-native'

import { Skeleton } from '~/components/ui/Skeleton'

import { COLORS } from '~/styles/theme'

export function EventCardLoading() {
  return (
    <View style={STYLES.card}>
      <Skeleton style={STYLES.badge} />
      <Skeleton style={STYLES.category} />
      <Skeleton style={STYLES.title} />
      <Skeleton style={STYLES.venue} />
      <Skeleton style={STYLES.date} />
    </View>
  )
}

const STYLES = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, backgroundColor: COLORS.surface },

  badge: { width: 56, height: 60, marginBottom: 16, borderRadius: 12 },

  category: { width: 64, height: 12, marginBottom: 10 },

  title: { width: '80%', height: 20 },

  venue: { width: '50%', height: 14, marginTop: 10 },

  date: { width: '60%', height: 12, marginTop: 20 },
})
