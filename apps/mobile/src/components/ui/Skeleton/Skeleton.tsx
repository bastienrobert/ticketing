import { useEffect, useState } from 'react'
import {
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { COLORS } from '~/styles/theme'

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ style }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(1))

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )

    pulse.start()
    return () => pulse.stop()
  }, [opacity])

  return <Animated.View style={[STYLES.skeleton, style, { opacity }]} />
}

const STYLES = StyleSheet.create({
  skeleton: { borderRadius: 8, backgroundColor: COLORS.control },
})
