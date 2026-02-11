import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAvatarEmoji } from "../../constants/avatars";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

export interface FoodOption {
  id: string;
  name: string;
  description: string;
  imageUri?: string;
  icon?: string;
  voteCount: number;
  voters?: string[]; // Array of emoji avatars
  isLeading?: boolean;
  hasVoted?: boolean;
}

interface FoodCardProps {
  food: FoodOption;
  onVote?: (foodId: string) => void;
}

/**
 * FoodCard Component
 * Card displaying a food option with image, votes, and vote button
 */
export const FoodCard: React.FC<FoodCardProps> = ({ food, onVote }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.foodImgContainer}>
        {/* Food Icon */}
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons 
            name={food.icon as any || 'silverware-fork-knife'} 
            size={48} 
            color={colors.primary.yellow} 
          />
        </View>
        {food.isLeading && (
          <View style={styles.badgeLeading}>
            <Text style={styles.badgeText}>{t('vote.leading')}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.votesRow}>
          <Text
            style={[
              styles.voteCount,
              !food.isLeading && styles.voteCountSecondary,
            ]}
          >
            {food.voteCount} {food.voteCount === 1 ? t('vote.vote') : t('vote.votes')}
          </Text>
          {food.voters && food.voters.length > 0 && (
            <View style={styles.avatarStack}>
              {food.voters.slice(0, 3).map((avatar, index) => (
                <View
                  key={index}
                  style={[
                    styles.miniAvatar,
                    index > 0 && styles.avatarOverlap,
                  ]}
                >
                  <Text style={styles.miniAvatarEmoji}>{getAvatarEmoji(avatar)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.contentInfo}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodDesc}>{food.description}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.btnVote,
              food.hasVoted
                ? styles.btnVoteSecondary
                : styles.btnVotePrimary,
            ]}
            onPress={() => onVote?.(food.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.btnVoteText,
                food.hasVoted && styles.btnVoteTextSecondary,
              ]}
            >
              {food.hasVoted ? t('vote.votedButton') : t('vote.voteButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: 25,
    ...shadows.card,
  },
  foodImgContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  foodImg: {
    width: "100%",
    height: "100%",
  },
  badgeLeading: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: colors.primary.yellow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  badgeText: {
    color: colors.text.dark,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
  },
  votesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  voteCount: {
    color: colors.primary.yellowDark,
    fontSize: 13,
    fontWeight: typography.weights.bold,
  },
  voteCountSecondary: {
    color: colors.text.grey,
    fontWeight: typography.weights.medium,
  },
  avatarStack: {
    flexDirection: "row",
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  contentInfo: {
    flex: 1,
    paddingRight: 10,
  },
  foodName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 6,
    color: colors.text.dark,
  },
  foodDesc: {
    fontSize: 13,
    color: colors.text.grey,
    lineHeight: 19,
    marginBottom: 15,
  },
  btnVote: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: borderRadius.sm,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  btnVotePrimary: {
    backgroundColor: colors.primary.yellow,
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  btnVoteSecondary: {
    backgroundColor: colors.pill.lightYellow,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
  },
  btnVoteText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  btnVoteTextSecondary: {
    color: colors.primary.yellowDark,
  },
});

