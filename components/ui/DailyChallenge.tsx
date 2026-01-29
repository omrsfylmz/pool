import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

interface DailyChallengeProps {
  title: string;
  current: number;
  total: number;
  nextReward?: string;
}

/**
 * DailyChallenge Component
 * Displays a daily challenge with progress bar
 */
export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  title,
  current,
  total,
  nextReward,
}) => {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
      </View>

      <View style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{title}</Text>
          <Text style={styles.challengeCount}>
            {current}/{total}
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        {nextReward && (
          <View style={styles.challengeInfo}>
            <FontAwesome5
              name="circle-info"
              size={12}
              color={colors.text.muted}
            />
            <Text style={styles.challengeInfoText}>Next: {nextReward}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  challengeCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 20,
    ...shadows.card,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeTitle: {
    fontWeight: typography.weights.bold,
    fontSize: 15,
    color: colors.text.dark,
  },
  challengeCount: {
    color: colors.primary.yellowDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: colors.background.light,
    borderRadius: 4,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary.yellow,
    borderRadius: 4,
  },
  challengeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  challengeInfoText: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
});

