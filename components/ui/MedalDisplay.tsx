import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";
import { AchievementMedal, FoodMedal } from "../../services/api";

interface MedalDisplayProps {
  medals: FoodMedal[];
  achievements?: AchievementMedal[];
}

/**
 * MedalDisplay Component
 * Shows user's food medals earned from past pool wins and achievement medals
 */
export const MedalDisplay: React.FC<MedalDisplayProps> = ({ medals, achievements = [] }) => {
  const totalMedals = medals.length + achievements.length;
  
  if (totalMedals === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🏆</Text>
        <Text style={styles.emptyTitle}>No Medals Yet!</Text>
        <Text style={styles.emptyText}>
          Win some pools to earn food medals
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Food Medals 🏆</Text>
        <Text style={styles.subtitle}>
          Earned from {medals[0]?.totalPools || 0} completed pools
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.medalScroll}
      >
        {medals.map((medal, index) => (
          <View
            key={medal.icon}
            style={[
              styles.medalCard,
              index === 0 && styles.medalCardFirst,
            ]}
          >
            {/* Rank Badge */}
            {index < 3 && (
              <View style={[styles.rankBadge, getRankStyle(index)]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
            )}

            {/* Icon Circle */}
            <View style={styles.iconCircle}>
              <FontAwesome5
                name={medal.icon}
                size={36}
                color={index === 0 ? "#FFD700" : colors.primary.yellow}
              />
            </View>

            {/* Medal Info */}
            <Text style={styles.medalName} numberOfLines={1}>
              {medal.name}
            </Text>
            <Text style={styles.medalWins}>
              {medal.wins} {medal.wins === 1 ? "win" : "wins"}
            </Text>
            <Text style={styles.medalPercentage}>{medal.percentage}%</Text>
          </View>
        ))}
      </ScrollView>

      {/* Achievement Medals Section */}
      {achievements.length > 0 && (
        <>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementTitle}>Achievements 🎖️</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.medalScroll}
          >
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                {/* Achievement Badge */}
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>NEW</Text>
                </View>

                {/* Icon Circle */}
                <View style={[styles.iconCircle, styles.achievementIconCircle]}>
                  <FontAwesome5
                    name={achievement.food_icon}
                    size={32}
                    color="#FF6B35"
                  />
                </View>

                {/* Achievement Info */}
                <Text style={styles.achievementName} numberOfLines={2}>
                  {formatAchievementName(achievement.achievement_type)}
                </Text>
                <Text style={styles.achievementDate}>
                  {new Date(achievement.earned_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

// Helper function to format achievement type to readable name
function formatAchievementName(achievementType: string): string {
  // Convert "first_burger_win" to "First Burger Win"
  return achievementType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function for rank badge colors
function getRankStyle(index: number) {
  switch (index) {
    case 0:
      return { backgroundColor: "#FFD700" }; // Gold
    case 1:
      return { backgroundColor: "#C0C0C0" }; // Silver
    case 2:
      return { backgroundColor: "#CD7F32" }; // Bronze
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
  medalScroll: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  medalCard: {
    width: 140,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    position: "relative",
    ...shadows.card,
  },
  medalCardFirst: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  medalName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
    textAlign: "center",
  },
  medalWins: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.primary.yellowDark,
    marginBottom: 2,
  },
  medalPercentage: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
  },
  emptyState: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 32,
    margin: 20,
    alignItems: "center",
    ...shadows.card,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    textAlign: "center",
  },
  achievementHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  achievementCard: {
    width: 130,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#FF6B35",
    ...shadows.card,
  },
  achievementBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  achievementBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: "#FFF",
  },
  achievementIconCircle: {
    backgroundColor: "#FFE5DC",
  },
  achievementName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 14,
  },
  achievementDate: {
    fontSize: 10,
    color: colors.text.grey,
  },
});
