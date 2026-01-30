import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

interface TimerCardProps {
  minutes: number;
  seconds: number;
  label?: string;
}

/**
 * TimerCard Component
 * Card displaying countdown timer with minutes and seconds
 */
export const TimerCard: React.FC<TimerCardProps> = ({
  minutes,
  seconds,
  label,
}) => {
  const { t } = useTranslation();
  const displayLabel = label || t('timer.endsIn');

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.timerLabel}>{displayLabel}</Text>
      <View style={styles.timerDisplay}>
        <View style={[styles.timeBox, styles.minutesBox]}>
          <Text style={styles.timeVal}>{formatTime(minutes)}</Text>
          <Text style={styles.timeUnit}>{t('timer.minLabel')}</Text>
        </View>
        <Text style={styles.timerColon}>:</Text>
        <View style={[styles.timeBox, styles.secondsBox]}>
          <Text style={[styles.timeVal, styles.secondsTimeVal]}>
            {formatTime(seconds)}
          </Text>
          <Text style={[styles.timeUnit, styles.secondsTimeUnit]}>
            {t('timer.secLabel')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 20,
    alignItems: "center",
    marginBottom: 25,
    ...shadows.card,
  },
  timerLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    fontWeight: typography.weights.bold,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timerDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  timeBox: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  minutesBox: {
    backgroundColor: colors.primary.yellow,
  },
  secondsBox: {
    backgroundColor: colors.banner.lightYellow,
    borderWidth: 2,
    borderColor: colors.primary.yellow,
  },
  timeVal: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    lineHeight: 24,
    marginBottom: 4,
    color: colors.background.card,
  },
  secondsTimeVal: {
    color: colors.primary.yellow,
  },
  timeUnit: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    color: colors.background.card,
  },
  secondsTimeUnit: {
    color: colors.primary.yellow,
  },
  timerColon: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
    marginBottom: 10,
  },
});

