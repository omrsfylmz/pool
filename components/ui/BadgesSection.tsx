import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "burger" | "salad" | "sun";
  earned: boolean;
}

interface BadgesSectionProps {
  badges: Badge[];
  earnedCount?: number;
  totalCount?: number;
  onViewAll?: () => void;
}

/**
 * BadgesSection Component
 * Displays user badges in a grid
 */
export const BadgesSection: React.FC<BadgesSectionProps> = ({
  badges,
  earnedCount = 0,
  totalCount = 12,
  onViewAll,
}) => {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "burger":
        return {
          backgroundColor: colors.primary.yellowLight,
          color: colors.primary.yellowDark,
        };
      case "salad":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        };
      case "sun":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
        };
      default:
        return {
          backgroundColor: colors.background.light,
          color: colors.text.grey,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lunch Hero Badges</Text>
        <TouchableOpacity 
          style={styles.countPill}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.countText}>
            {earnedCount}/{totalCount} Won
          </Text>
          <FontAwesome5 name="chevron-right" size={10} color={colors.primary.yellowDark} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.badgesGrid}>
        {badges.map((badge) => {
          const badgeStyle = getBadgeStyle(badge.type);
          return (
            <View key={badge.id} style={styles.badgeItem}>
              <View
                style={[
                  styles.badgeCircle,
                  { backgroundColor: badgeStyle.backgroundColor },
                ]}
              >
                <FontAwesome5
                  name={badge.icon as any}
                  size={24}
                  color={badgeStyle.color}
                />
              </View>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeSub}>{badge.subtitle}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  countPill: {
    backgroundColor: colors.pill.lightYellow,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  countText: {
    color: colors.primary.yellowDark,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  badgeItem: {
    width: "30%",
    alignItems: "center",
  },
  badgeCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
    color: colors.text.dark,
    textAlign: "center",
  },
  badgeSub: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: "center",
  },
});

