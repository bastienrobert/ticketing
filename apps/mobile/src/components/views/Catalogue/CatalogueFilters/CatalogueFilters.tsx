import { ScrollView, StyleSheet, TextInput, View } from 'react-native'

import { CatalogueFiltersCategory } from './CatalogueFiltersCategory'
import { Icon } from '~/components/ui/Icon'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface CatalogueFiltersProps {
  query: string
  category: string | null
  categories: string[]
  onQueryChange: (query: string) => void
  onCategoryChange: (category: string | null) => void
}

export function CatalogueFilters({
  query,
  category,
  categories,
  onQueryChange,
  onCategoryChange,
}: CatalogueFiltersProps) {
  const searchLabel = i18n.t('catalogue.search')

  return (
    <View style={STYLES.container}>
      <View style={STYLES.search}>
        <Icon name="search" />
        <TextInput
          accessibilityLabel={searchLabel}
          placeholder={searchLabel}
          placeholderTextColor={COLORS.muted}
          value={query}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={STYLES.input}
          onChangeText={onQueryChange}
        />
      </View>

      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        style={STYLES.carousel}
        contentContainerStyle={STYLES.categories}>
        <CatalogueFiltersCategory
          label={i18n.t('catalogue.all_categories')}
          selected={category === null}
          onPress={() => onCategoryChange(null)}
        />

        {categories.map((value) => {
          return (
            <CatalogueFiltersCategory
              key={value}
              label={value}
              selected={category === value}
              onPress={() => onCategoryChange(value)}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

const STYLES = StyleSheet.create({
  container: { gap: 12 },

  search: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    backgroundColor: COLORS.control,
  },

  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },

  // bleeds through the list padding so the chips scroll to the screen edges
  carousel: { marginHorizontal: -20 },

  categories: {
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 20,
  },
})
