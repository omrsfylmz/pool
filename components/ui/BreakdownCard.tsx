import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

export interface BreakdownItem {
  id: string;
  name: string;
  emoji: string;
  votes: number;
  percentage: number;
  isWinner?: boolean;
  color?: string;
}

export interface TieBreakerInfo {
  message: string;
}

interface BreakdownCardProps {
  totalVotes: number;
  items: BreakdownItem[];
  tieBreaker?: TieBreakerInfo;
  voters?: string[];
  onViewAllVoters?: () => void;
}

/**
 * BreakdownCard Component
 * Card showing detailed vote breakdown with progress bars
 */
export const BreakdownCard: React.FC<BreakdownCardProps> = ({
  totalVotes,
  items,
  tieBreaker,
  voters = [],
  onViewAllVoters,
}) => {
  const maxAvatars = 3;
  const visibleVoters = voters.slice(0, maxAvatars);
  const remainingCount = voters.length - visibleVoters.length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.breakdownTitle}>Vote Breakdown</Text>
        <Text style={styles.voteTotal}>{totalVotes} Votes total</Text>
      </View>

      {items.map((item, index) => (
        <View key={item.id} style={styles.voteItem}>
          <View style={styles.voteRowTop}>
            <Text style={styles.foodLabel}>
              {item.emoji} {item.name}
            </Text>
            <Text
              style={[
                styles.voteNumber,
                item.isWinner && styles.voteNumberWinner,
              ]}
            >
              {item.votes} VOTES
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.percentage}%`,
                  backgroundColor: item.isWinner
                    ? colors.primary.yellow
                    : item.color || colors.text.disabled,
                },
              ]}
            />
          </View>
          {tieBreaker && index === 0 && (
            <View style={styles.tieBox}>
              <FontAwesome5
                name="random"
                size={12}
                color={colors.primary.yellowDark}
              />
              <Text style={styles.tieText}>{tieBreaker.message}</Text>
            </View>
          )}
        </View>
      ))}

      {voters.length > 0 && (
        <View style={styles.votersFooter}>
          <View style={styles.avatarGroup}>
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
              <View style={[styles.miniAvatar, styles.moreVoters]}>
                <Text style={styles.moreVotersText}>+{remainingCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onViewAllVoters} activeOpacity={0.7}>
            <Text style={styles.viewAllLink}>View all voters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 24,
    marginBottom: 20,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  breakdownTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  voteTotal: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  voteItem: {
    marginBottom: 25,
  },
  voteRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  foodLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  voteNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.muted,
  },
  voteNumberWinner: {
    color: colors.primary.yellow,
  },
  progressBg: {
    width: "100%",
    height: 10,
    backgroundColor: colors.background.light,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  tieBox: {
    backgroundColor: colors.banner.lightYellow,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
    borderRadius: borderRadius.sm,
    padding: 12,
    marginTop: 15,
    marginBottom: 5,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  tieText: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.text.grey,
    lineHeight: 18,
    flex: 1,
  },
  votersFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.background.light,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.light,
    borderWidth: 2,
    borderColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  miniAvatarEmoji: {
    fontSize: 14,
  },
  moreVoters: {
    marginLeft: -8,
    backgroundColor: colors.background.light,
  },
  moreVotersText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
  },
});

