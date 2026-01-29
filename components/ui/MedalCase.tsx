import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography } from "../../constants/theme";

export type MedalStatus = "earned" | "available" | "locked";

export interface Medal {
  id: string;
  name: string;
  icon: string;
  status: MedalStatus;
  isNew?: boolean;
}

interface MedalCaseProps {
  medals: Medal[];
  earnedCount?: number;
}

/**
 * MedalCase Component
 * Displays a row of achievement medals
 */
export const MedalCase: React.FC<MedalCaseProps> = ({
  medals,
  earnedCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medal Case</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>{earnedCount} Earned</Text>
        </View>
      </View>

      <View style={styles.medalRow}>
        {medals.map((medal) => (
          <View key={medal.id} style={styles.medalItem}>
            <View style={[styles.medalCircle, styles[medal.status]]}>
              {medal.isNew && (
                <View style={styles.newTag}>
                  <Text style={styles.newTagText}>NEW</Text>
                </View>
              )}
              <FontAwesome5
                name={medal.icon as any}
                size={28}
                color={
                  medal.status === "earned"
                    ? colors.background.card
                    : medal.status === "available"
                    ? colors.text.muted
                    : colors.text.disabled
                }
              />
            </View>
            <Text style={styles.medalName}>{medal.name}</Text>
            <Text
              style={[
                styles.medalStatus,
                medal.status === "earned" && styles.medalStatusGold,
              ]}
            >
              {medal.status === "earned"
                ? "Earned!"
                : medal.status === "available"
                ? "Available"
                : "Locked"}
            </Text>
          </View>
        ))}
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
  badgeCount: {
    backgroundColor: colors.primary.yellowLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.primary.yellowDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  medalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  medalItem: {
    alignItems: "center",
    width: 80,
  },
  medalCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  earned: {
    backgroundColor: colors.primary.yellow,
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  available: {
    backgroundColor: colors.background.light,
  },
  locked: {
    backgroundColor: colors.background.grey,
  },
  newTag: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.primary.yellow,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background.card,
  },
  newTagText: {
    color: colors.background.card,
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  medalName: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    lineHeight: 16,
    color: colors.text.dark,
    marginBottom: 2,
    textAlign: "center",
  },
  medalStatus: {
    fontSize: 11,
    color: colors.text.lightGrey,
  },
  medalStatusGold: {
    color: colors.primary.yellowDark,
  },
});

