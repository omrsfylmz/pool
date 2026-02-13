import React, { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { colors } from "../../constants/theme";
import type { Pool } from "../../services/api";
import { ActivePoolCard } from "./ActivePoolCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ActivePoolsCarouselProps {
  pools: Pool[];
  onPoolPress: (pool: Pool) => void;
  onTimerEnd: () => void;
}

export function ActivePoolsCarousel({ pools, onPoolPress, onTimerEnd }: ActivePoolsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // All hooks MUST be called before any conditional returns (Rules of Hooks)
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(({ item }: { item: Pool }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <ActivePoolCard
        pool={item}
        onPress={() => onPoolPress(item)}
        onTimerEnd={onTimerEnd}
      />
    </View>
  ), [onPoolPress, onTimerEnd]);

  if (pools.length === 0) return null;

  // Single pool — render directly without carousel chrome
  if (pools.length === 1) {
    return (
      <ActivePoolCard
        pool={pools[0]}
        onPress={() => onPoolPress(pools[0])}
        onTimerEnd={onTimerEnd}
      />
    );
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={pools}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
      />

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {pools.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary.yellow,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    backgroundColor: colors.border.light,
  },
});
