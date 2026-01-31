import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";
import type { Pool } from "../../services/api";

interface ActivePoolCardProps {
  pool: Pool;
  onPress: () => void;
  onTimerEnd?: () => void;
}

export function ActivePoolCard({ pool, onPress, onTimerEnd }: ActivePoolCardProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Calculate time remaining
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(pool.ends_at).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        // Notify parent that timer has ended
        if (onTimerEnd) {
          onTimerEnd();
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pool.ends_at, onTimerEnd]);

  // Pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={styles.liveDot} />
            <Text style={styles.badgeText}>{t('dashboard.activePool.title')}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color={colors.text.grey} />
        </View>

        {/* Pool Title */}
        <Text style={styles.title} numberOfLines={2}>
          {pool.title}
        </Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <FontAwesome5 name="clock" size={16} color={colors.primary.yellow} />
          <Text style={styles.timerLabel}>{t('dashboard.activePool.endsIn')}</Text>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </Text>
          </View>
        </View>

        {/* Join Button */}
        <View style={styles.buttonContainer}>
          <View style={styles.joinButton}>
            <FontAwesome5 name="vote-yea" size={16} color={colors.text.dark} />
            <Text style={styles.joinButtonText}>{t('dashboard.activePool.joinButton')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary.yellow,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 14,
    color: colors.text.grey,
    marginLeft: 8,
    marginRight: 8,
  },
  timerDisplay: {
    flex: 1,
    alignItems: "flex-end",
  },
  timerText: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
    fontVariant: ["tabular-nums"],
  },
  buttonContainer: {
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: colors.primary.yellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
