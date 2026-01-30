import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

export interface Poll {
  id: string;
  title: string;
  date: string;
  icon: string;
  iconColor: "taco" | "pizza";
  avatars: string[];
}

interface PastPollsProps {
  polls: Poll[];
  onViewAll?: () => void;
}

/**
 * PastPolls Component
 * Displays a list of past poll cards
 */
export const PastPolls: React.FC<PastPollsProps> = ({ polls, onViewAll }) => {
  const { t } = useTranslation();
  const getIconStyle = (color: "taco" | "pizza") => {
    return color === "taco"
      ? { backgroundColor: colors.accent.taco, color: colors.accent.tacoDark }
      : { backgroundColor: colors.accent.pizza, color: colors.accent.redIcon };
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dashboard.pastPolls')}</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>{t('dashboard.viewAll')}</Text>
        </TouchableOpacity>
      </View>

      {polls.map((poll) => {
        const iconStyle = getIconStyle(poll.iconColor);
        return (
          <View key={poll.id} style={styles.pollCard}>
            <View style={[styles.pollIcon, { backgroundColor: iconStyle.backgroundColor }]}>
              <FontAwesome5
                name={poll.icon as any}
                size={20}
                color={iconStyle.color}
              />
            </View>
            <View style={styles.pollInfo}>
              <Text style={styles.pollTitle}>{poll.title}</Text>
              <Text style={styles.pollDate}>{poll.date}</Text>
            </View>
            <View style={styles.avatarGroup}>
              {poll.avatars.map((avatar, index) => (
                <View
                  key={index}
                  style={[
                    styles.avatar,
                    index > 0 && styles.avatarOverlap,
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
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
  viewAll: {
    color: colors.primary.yellowDark,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  pollCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
  },
  pollIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  pollInfo: {
    flex: 1,
  },
  pollTitle: {
    fontWeight: typography.weights.bold,
    fontSize: 15,
    color: colors.text.dark,
    marginBottom: 4,
  },
  pollDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.lightGrey,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.background.card,
    backgroundColor: colors.background.light,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  avatarEmoji: {
    fontSize: 18,
  },
});

