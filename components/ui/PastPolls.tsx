import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
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
  onDelete?: (poolId: string) => void;
  onReactivate?: (pool: Poll) => void;
  onPress?: (poolId: string) => void;
}

/**
 * PastPolls Component
 * Displays a list of past poll cards
 */
export const PastPolls: React.FC<PastPollsProps> = ({ polls, onViewAll, onDelete, onReactivate, onPress }) => {
  const { t } = useTranslation();
  const getIconStyle = (color: "taco" | "pizza") => {
    return color === "taco"
      ? { backgroundColor: colors.accent.taco, color: colors.accent.tacoDark }
      : { backgroundColor: colors.accent.pizza, color: colors.accent.redIcon };
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    pool: Poll
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionsContainer}>
        {onReactivate && (
          <TouchableOpacity
            style={styles.reactivateAction}
            onPress={() => onReactivate(pool)}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <FontAwesome5 name="redo" size={20} color={colors.text.dark} />
              <Text style={[styles.actionText, { color: colors.text.dark }]}>{t('pastPools.reactivate')}</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => onDelete(pool.id)}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <FontAwesome5 name="trash-alt" size={20} color="#FFF" />
              <Text style={[styles.actionText, { color: '#FFF' }]}>{t('common.delete')}</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    );
    );
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
        
        // Wrap with Swipeable only if onDelete or onReactivate is provided
        const content = (
          <TouchableOpacity 
            style={[styles.pollCard, { marginBottom: 0 }]}
            onPress={() => onPress?.(poll.id)}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}
          >
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
          </TouchableOpacity>
        );

        if (onDelete || onReactivate) {
          return (
            <View key={poll.id} style={styles.pollCardContainer}>
              <Swipeable
                renderRightActions={(progress, dragX) => 
                  renderRightActions(progress, dragX, poll)
                }
                overshootRight={false}
              >
                {content}
              </Swipeable>
            </View>
          );
        }

        return <View key={poll.id} style={{ marginBottom: 16 }}>{content}</View>;
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
  pollCardContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
    ...shadows.card,
    marginBottom: 16,
  },
  pollCard: {
    backgroundColor: colors.background.card,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
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
  deleteAction: {
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  reactivateAction: {
    backgroundColor: colors.primary.yellow,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  rightActionsContainer: {
    flexDirection: 'row',
  },
  actionText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});

