import {
  useLocalSearchParams,
  useRouter,
  type ErrorBoundaryProps,
} from 'expo-router'
import { Suspense, use, useTransition, type ReactNode } from 'react'
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FavoriteButton } from '~/components/ui/FavoriteButton'
import { Icon } from '~/components/ui/Icon'
import { Skeleton } from '~/components/ui/Skeleton'

import { useFavoritesContext } from '~/contexts/FavoritesContext'
import { useRequest } from '~/hooks/useRequest'

import { getEventPage } from '~/data/get-event-page'
import { applePay } from '~/lib/apple-pay'
import { addToCalendar, type CalendarResult } from '~/lib/calendar'
import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface EventPageData {
  id: number
  title: string
  category: string
  description: string
  venue: string
  address: string
  startsAt: string
  date: string
  price: string
  amount: string | null
}

export default function EventPage() {
  const { id } = useLocalSearchParams<'/events/[id]'>()
  const [, page] = useRequest((signal) => getEventPage(Number(id), signal))

  return (
    <Suspense fallback={<EventPageLoading />}>
      <EventPageContent page={page} />
    </Suspense>
  )
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <EventPageSheet>
      <View style={STYLES.content}>
        <Text accessibilityRole="header" style={STYLES.title}>
          {i18n.t('event.error.title')}
        </Text>
        <Text style={STYLES.description}>
          {i18n.t('event.error.description')}
        </Text>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [STYLES.retry, pressed && STYLES.pressed]}
          onPress={retry}>
          <Text style={STYLES.retryLabel}>{i18n.t('event.error.button')}</Text>
        </Pressable>
      </View>
    </EventPageSheet>
  )
}

interface EventPageSheetProps {
  actions?: ReactNode
  children: ReactNode
}

// the toolbar and its close button stay available whatever the request state
function EventPageSheet({ actions, children }: EventPageSheetProps) {
  const router = useRouter()

  function onClose() {
    router.dismiss()
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={STYLES.screen}
      onAccessibilityEscape={onClose}>
      <View style={STYLES.toolbar}>
        {actions}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={i18n.t('event.close')}
          style={({ pressed }) => [STYLES.close, pressed && STYLES.pressed]}
          onPress={onClose}>
          <Icon name="close" color={COLORS.text} size={16} />
        </Pressable>
      </View>

      {children}
    </SafeAreaView>
  )
}

interface EventPageContentProps {
  page: Promise<EventPageData | null>
}

function EventPageContent({ page }: EventPageContentProps) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext()
  const [buying, startBuying] = useTransition()
  const event = use(page)

  // a redirect would replace the sheet with a second tabs screen, so the sheet stays open
  if (!event) {
    return (
      <EventPageSheet>
        <View style={STYLES.content}>
          <Text accessibilityRole="header" style={STYLES.title}>
            {i18n.t('event.not_found.title')}
          </Text>
          <Text style={STYLES.description}>
            {i18n.t('event.not_found.description')}
          </Text>
        </View>
      </EventPageSheet>
    )
  }

  const details = [
    { label: i18n.t('event.date'), value: event.date },
    { label: i18n.t('event.venue'), value: `${event.venue}\n${event.address}` },
    { label: i18n.t('event.price'), value: event.price },
  ]

  const { title, description, startsAt, venue, address, amount } = event

  function onBuy() {
    if (!amount) return

    startBuying(async () => {
      const payment = await applePay.pay(title, amount).catch(() => null)

      if (payment === null) {
        Alert.alert(
          i18n.t('event.purchase.error.title'),
          i18n.t('event.purchase.error.description'),
        )
        return
      }

      if (!payment) return

      const calendar = await addToCalendar({
        title,
        description,
        startsAt,
        venue,
        address,
      }).catch(() => null)
      alertPurchase(title, calendar)
    })
  }

  const favoriteButton = (
    <FavoriteButton
      title={event.title}
      selected={favoriteIds.includes(event.id)}
      onToggle={() => toggleFavorite(event.id)}
    />
  )

  return (
    <EventPageSheet actions={favoriteButton}>
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

      {amount && applePay.canMakePayments() && (
        <View style={STYLES.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: buying }}
            disabled={buying}
            style={({ pressed }) => [STYLES.buy, pressed && STYLES.pressed]}
            onPress={onBuy}>
            <Text style={STYLES.buyLabel}>{i18n.t('event.buy')}</Text>
          </Pressable>
        </View>
      )}
    </EventPageSheet>
  )
}

function alertPurchase(title: string, calendar: CalendarResult | null) {
  const heading = i18n.t('event.purchase.success.title')
  const description = i18n.t('event.purchase.success.description', { title })

  switch (calendar) {
    case 'added':
      return Alert.alert(
        heading,
        `${description}\n\n${i18n.t('event.purchase.calendar.added')}`,
      )
    // refused for good: only the Settings can allow it now
    case 'blocked':
      return Alert.alert(
        heading,
        `${description}\n\n${i18n.t('event.purchase.calendar.blocked')}`,
        [
          { text: i18n.t('event.purchase.calendar.later'), style: 'cancel' },
          {
            text: i18n.t('event.purchase.calendar.settings'),
            onPress: () => Linking.openSettings(),
          },
        ],
      )
    // just refused at the prompt: the choice is respected, without insisting
    default:
      return Alert.alert(heading, description)
  }
}

// mirrors the content: category, title, description and the details card
function EventPageLoading() {
  return (
    <EventPageSheet>
      <View
        accessible
        accessibilityLabel={i18n.t('event.loading')}
        accessibilityState={{ busy: true }}
        style={STYLES.content}>
        <Skeleton style={STYLES.categorySkeleton} />
        <Skeleton style={STYLES.titleSkeleton} />
        <Skeleton style={[STYLES.titleSkeleton, STYLES.shortSkeleton]} />

        <View style={STYLES.descriptionSkeleton}>
          <Skeleton style={STYLES.lineSkeleton} />
          <Skeleton style={STYLES.lineSkeleton} />
          <Skeleton style={[STYLES.lineSkeleton, STYLES.shortSkeleton]} />
        </View>

        <Skeleton style={STYLES.detailsSkeleton} />
      </View>
    </EventPageSheet>
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

  footer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },

  buy: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.text,
  },

  buyLabel: {
    color: COLORS.surface,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },

  retry: {
    minHeight: 44,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: COLORS.accent,
  },

  retryLabel: {
    color: COLORS.surface,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  categorySkeleton: { width: 72, height: 14, marginTop: 3, marginBottom: 11 },

  titleSkeleton: { width: '90%', height: 32, marginVertical: 3.5 },

  shortSkeleton: { width: '60%' },

  descriptionSkeleton: { marginTop: 24, gap: 10 },

  lineSkeleton: { height: 16 },

  detailsSkeleton: { height: 220, marginTop: 28, borderRadius: 20 },
})
