import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface WinnerSectionProps {
  winnerName: string;
  subtitle?: string;
}

/**
 * WinnerSection Component
 * Displays the winning choice with celebration badge
 */
export const WinnerSection: React.FC<WinnerSectionProps> = ({
  winnerName,
  subtitle = "The Office has spoken! 🍕",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.winnerBadge}>
        <FontAwesome5 name="trophy" size={10} color={colors.primary.yellowDark} />
        <Text style={styles.badgeText}> Winning Choice</Text>
      </View>
      <Text style={styles.winnerTitle}>{winnerName.toUpperCase()}!</Text>
      <Text style={styles.winnerSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  winnerBadge: {
    backgroundColor: colors.pill.lightYellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
  },
  badgeText: {
    color: colors.primary.yellowDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  winnerTitle: {
    fontSize: 48,
    fontStyle: "italic",
    fontWeight: "800",
    color: colors.primary.yellow,
    lineHeight: 48,
    marginBottom: 10,
    textShadowColor: "rgba(242, 184, 56, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  winnerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
  },
});

