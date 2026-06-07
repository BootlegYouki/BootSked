import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../theme/theme-provider';
import { TuiText } from './tui-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ScreenType = 'screen1' | 'screen2' | 'action' | 'screen3' | 'screen4' | 'settings';

interface TuiTabBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onLongPressAdd?: () => void;
  startAnimation?: boolean;
}

export const TuiTabBar: React.FC<TuiTabBarProps> = ({
  currentScreen,
  onNavigate,
  onLongPressAdd,
  startAnimation = false,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [buttonWidth, setButtonWidth] = React.useState(64);
  const [legendWidth, setLegendWidth] = React.useState(24);

  const borderAccent = colors.primary;
  const isPlusActive = currentScreen === 'action';

  const [tabAnimAdd] = React.useState(() => new Animated.Value(startAnimation ? 0 : 1));

  React.useEffect(() => {
    if (!startAnimation) return;
    Animated.spring(tabAnimAdd, {
      toValue: 1,
      friction: 9,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [startAnimation, tabAnimAdd]);

  const topSegmentWidth = Math.max(0, (buttonWidth - legendWidth) / 2);

  return (
    <View style={[styles.shadowWrapper, { bottom: insets.bottom }]}>
      <View style={styles.navRow}>
        {/* Spacer to push the button to the right side */}
        <View style={{ flex: 1 }} />
        
        <Animated.View
          style={{
            opacity: tabAnimAdd,
            transform: [
              { scale: tabAnimAdd },
              {
                translateY: tabAnimAdd.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <Pressable
            onPress={() => onNavigate('action')}
            onLongPress={onLongPressAdd}
            delayLongPress={350}
            onLayout={(e) => {
              setButtonWidth(e.nativeEvent.layout.width);
            }}
            style={[
              styles.plusBtnSquare,
              {
                backgroundColor: isPlusActive ? (isDark ? '#27272A' : '#E4E4E7') : colors.card,
              },
            ]}
          >
            {/* Dynamic Segmented Borders */}
            <View style={[styles.borderLeft, { backgroundColor: borderAccent }]} />
            <View style={[styles.borderRight, { backgroundColor: borderAccent }]} />
            <View style={[styles.borderBottom, { backgroundColor: borderAccent }]} />
            <View style={[styles.borderTopLeft, { backgroundColor: borderAccent, width: topSegmentWidth }]} />
            <View style={[styles.borderTopRight, { backgroundColor: borderAccent, width: topSegmentWidth }]} />

            {/* Brutalist legend resting on top border */}
            <View
              onLayout={(e) => {
                setLegendWidth(e.nativeEvent.layout.width);
              }}
              style={[
                styles.legendWrapper,
                {
                  backgroundColor: 'transparent',
                  paddingHorizontal: 2,
                }
              ]}
            >
              <TuiText
                weight="bold"
                style={[
                  styles.legendText,
                  { color: isPlusActive ? colors.primary : colors.mutedForeground },
                ]}
              >
                Add
              </TuiText>
            </View>

            <View style={styles.tabContent} pointerEvents="none">
              <Plus
                size={22}
                color={isPlusActive ? colors.primary : colors.mutedForeground}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    zIndex: 9995,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  plusBtnSquare: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  borderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1.5,
    zIndex: 5,
  },
  borderRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 1.5,
    zIndex: 5,
  },
  borderBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1.5,
    zIndex: 5,
  },
  borderTopLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 1.5,
    zIndex: 5,
  },
  borderTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 1.5,
    zIndex: 5,
  },
  legendWrapper: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 2,
    zIndex: 10,
  },
  legendText: {
    fontSize: 18,
    letterSpacing: 0.2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
