import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, typography, borderRadius } from "../../constants/theme";

interface StatusPillProps {
  message?: string;
}

/**
 * StatusPill Component
 * Status indicator with pulsing dot animation
 */
export const StatusPill: React.FC<StatusPillProps> = ({
  message = "Waiting for others to join...",
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulsingDot,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.2],
              outputRange: [1, 0.7],
            }),
          },
        ]}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pill.lightYellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary.yellow,
    borderRadius: 5,
  },
  message: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.dark,
  },
});

