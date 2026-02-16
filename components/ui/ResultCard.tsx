import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

export interface ResultItem {
  id: string;
  name: string;
  rank: number;
  voteCount: number;
  popularity: number; // percentage
  icon?: string; // MaterialCommunityIcons icon name
  imageUri?: string | ImageSourcePropType;
  voters?: string[]; // Array of emoji avatars
  isWinner?: boolean;
}

interface ResultCardProps {
  result: ResultItem;
}

/**
 * ResultCard Component
 * Card displaying food option results with rank, votes, and progress bar
 */
export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t } = useTranslation();
  const maxAvatars = 4;
  const visibleVoters = result.voters?.slice(0, maxAvatars) || [];
  const remainingCount =
    (result.voters?.length || 0) - visibleVoters.length;

  // Determine progress bar color based on popularity
  const getProgressColor = (popularity: number) => {
    if (popularity >= 80) return "#4CAF50"; // Green
    if (popularity >= 50) return colors.primary.yellow; // Yellow
    if (popularity >= 20) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <View
      style={[
        styles.card,
        result.isWinner && styles.winnerCard,
      ]}
    >
      <View style={styles.cardTop}>
        {/* Food Icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={(result.icon === 'pizza-slice' ? 'pizza' : result.icon === 'utensils' ? 'silverware-fork-knife' : result.icon) as any || "silverware-fork-knife"}
            size={28}
            color={colors.primary.yellow}
          />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.infoHeader}>
            <View style={styles.rankTitle}>
              <Text
                style={[
                  styles.rankNum,
                  result.isWinner ? styles.rankNumGold : styles.rankNumGrey,
                ]}
              >
                #{result.rank}
              </Text>
              <Text style={styles.foodName}>{result.name}</Text>
            </View>
            <View style={styles.voteStat}>
              {result.isWinner && (
                <MaterialCommunityIcons
                  name="trophy"
                  size={14}
                  color={colors.primary.yellow}
                  style={styles.trophyIcon}
                />
              )}
              <Text style={styles.voteNum}>{result.voteCount}</Text>
              <Text style={styles.voteLabel}>{t('vote.votes')}</Text>
            </View>
          </View>
          {result.voters && result.voters.length > 0 && (
            <View style={styles.avatarRow}>
              {visibleVoters.map((avatar, index) => (
                <View
                  key={index}
                  style={[
                    styles.miniAvatar,
                    index > 0 && styles.avatarOverlap,
                  ]}
                >
                  <Text style={styles.miniAvatarEmoji}>{avatar}</Text>
                </View>
              ))}
              {remainingCount > 0 && (
                <Text style={styles.moreCount}>+{remainingCount}</Text>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.popLabelRow}>
          <Text style={styles.popLabel}>{t('results.popularity')}</Text>
          <Text
            style={[
              styles.popPercent,
              !result.isWinner && styles.popPercentGrey,
            ]}
          >
            {result.popularity}%
          </Text>
        </View>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${result.popularity}%`,
                backgroundColor: getProgressColor(result.popularity),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...shadows.card,
  },
  winnerCard: {
    borderWidth: 2,
    borderColor: colors.primary.yellow,
  },
  cardTop: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rankTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  rankNum: {
    fontWeight: typography.weights.bold,
  },
  rankNumGold: {
    color: colors.primary.yellowDark,
  },
  rankNumGrey: {
    color: colors.text.muted,
  },
  foodName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  voteStat: {
    alignItems: "flex-end",
  },
  trophyIcon: {
    marginBottom: 2,
  },
  voteNum: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  voteLabel: {
    fontSize: 10,
    color: colors.text.grey,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
  },
  avatarRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  avatarOverlap: {
    marginLeft: -6,
  },
  miniAvatarEmoji: {
    fontSize: 12,
  },
  moreCount: {
    marginLeft: 10,
    fontSize: 11,
    color: colors.text.grey,
    fontWeight: typography.weights.medium,
  },
  progressSection: {
    gap: 5,
  },
  popLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
    textTransform: "uppercase",
  },
  popLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
    textTransform: "uppercase",
  },
  popPercent: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
    textTransform: "uppercase",
  },
  popPercentGrey: {
    color: colors.text.grey,
  },
  barBg: {
    width: "100%",
    height: 6,
    backgroundColor: colors.background.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
});

