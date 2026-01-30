import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface TimerSectionProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * TimerSection Component
 * Displays countdown timer with hours, minutes, and seconds
 */
export const TimerSection: React.FC<TimerSectionProps> = ({
  hours = 0,
  minutes = 42,
  seconds = 18,
}) => {
  const { t } = useTranslation();

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerBox}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{formatTime(hours)}</Text>
        </View>
        <Text style={styles.timeLabel}>{t('timer.hrs')}</Text>
      </View>
      <Text style={styles.timerColon}>:</Text>
      <View style={styles.timerBox}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{formatTime(minutes)}</Text>
        </View>
        <Text style={styles.timeLabel}>{t('timer.min')}</Text>
      </View>
      <Text style={styles.timerColon}>:</Text>
      <View style={styles.timerBox}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{formatTime(seconds)}</Text>
        </View>
        <Text style={styles.timeLabel}>{t('timer.sec')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 30,
  },
  timerBox: {
    alignItems: "center",
  },
  timeBlock: {
    width: 50,
    height: 50,
    backgroundColor: colors.pill.lightYellow,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellowDark,
  },
  timeLabel: {
    fontSize: 10,
    color: colors.text.muted,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
  },
  timerColon: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellowDark,
    marginTop: 10,
  },
});

