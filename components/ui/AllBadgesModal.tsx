import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

export interface BadgeDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
  type: "food" | "participation" | "achievement";
  color: string;
  backgroundColor: string;
}

interface AllBadgesModalProps {
  visible: boolean;
  onClose: () => void;
  earnedBadgeIds: string[];
}

// All 12 available badges
const ALL_BADGES: BadgeDefinition[] = [
  // Welcome Badge
  {
    id: "newcomer",
    icon: "user-plus",
    name: "Newcomer",
    description: "Joined FoodPool!",
    type: "achievement",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
  },
  // Food Preference Badges
  {
    id: "burger_monster",
    icon: "hamburger",
    name: "Burger Monster",
    description: "Won 5 burger votes",
    type: "food",
    color: "#92400e",
    backgroundColor: "#fef3c7",
  },
  {
    id: "salad_sultan",
    icon: "leaf",
    name: "Salad Sultan",
    description: "Chose healthy 5 times",
    type: "food",
    color: "#166534",
    backgroundColor: "#dcfce7",
  },
  {
    id: "pizza_pro",
    icon: "pizza-slice",
    name: "Pizza Pro",
    description: "Won 5 pizza votes",
    type: "food",
    color: "#991b1b",
    backgroundColor: "#fee2e2",
  },
  {
    id: "taco_titan",
    icon: "pepper-hot",
    name: "Taco Titan",
    description: "Won 5 taco votes",
    type: "food",
    color: "#ea580c",
    backgroundColor: "#ffedd5",
  },
  // Participation Badges
  {
    id: "early_bird",
    icon: "sun",
    name: "Early Bird",
    description: "First to vote 3 times",
    type: "participation",
    color: "#1e40af",
    backgroundColor: "#dbeafe",
  },
  {
    id: "consistent_voter",
    icon: "check-circle",
    name: "Consistent Voter",
    description: "Voted in 10 pools",
    type: "participation",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
  },
  {
    id: "streak_master",
    icon: "fire",
    name: "Streak Master",
    description: "5-day voting streak",
    type: "participation",
    color: "#dc2626",
    backgroundColor: "#fee2e2",
  },
  {
    id: "pool_creator",
    icon: "plus-circle",
    name: "Pool Creator",
    description: "Created 5 pools",
    type: "participation",
    color: "#059669",
    backgroundColor: "#d1fae5",
  },
  // Achievement Badges
  {
    id: "winner_winner",
    icon: "trophy",
    name: "Winner Winner",
    description: "Your choice won 10x",
    type: "achievement",
    color: "#ca8a04",
    backgroundColor: "#fef9c3",
  },
  {
    id: "tie_breaker",
    icon: "dice",
    name: "Tie Breaker",
    description: "Broke 3 ties",
    type: "achievement",
    color: "#4338ca",
    backgroundColor: "#e0e7ff",
  },
  {
    id: "idea_generator",
    icon: "lightbulb",
    name: "Idea Generator",
    description: "Added 10 suggestions",
    type: "achievement",
    color: "#d97706",
    backgroundColor: "#fef3c7",
  },
];

export function AllBadgesModal({ visible, onClose, earnedBadgeIds }: AllBadgesModalProps) {
  const { t } = useTranslation();

  const isBadgeEarned = (badgeId: string) => earnedBadgeIds.includes(badgeId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Badges</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={24} color={colors.text.dark} />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {earnedBadgeIds.length} of {ALL_BADGES.length} earned
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(earnedBadgeIds.length / ALL_BADGES.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Badges Grid */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Newcomer Badge */}
          <Text style={styles.categoryTitle}>🎉 Welcome</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.id === "newcomer").map((badge) => {
              const earned = isBadgeEarned(badge.id);
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeCircle,
                      {
                        backgroundColor: earned ? badge.backgroundColor : "#f3f4f6",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={badge.icon as any}
                      size={28}
                      color={earned ? badge.color : "#9ca3af"}
                    />
                    {!earned && (
                      <View style={styles.lockOverlay}>
                        <FontAwesome5 name="lock" size={16} color="#6b7280" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeName, !earned && styles.unearnedText]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              );
            })}
          </View>

          {/* Food Badges */}
          <Text style={styles.categoryTitle}>🍔 Food Preferences</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.type === "food").map((badge) => {
              const earned = isBadgeEarned(badge.id);
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeCircle,
                      {
                        backgroundColor: earned ? badge.backgroundColor : "#f3f4f6",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={badge.icon as any}
                      size={28}
                      color={earned ? badge.color : "#9ca3af"}
                    />
                    {!earned && (
                      <View style={styles.lockOverlay}>
                        <FontAwesome5 name="lock" size={16} color="#6b7280" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeName, !earned && styles.unearnedText]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              );
            })}
          </View>

          {/* Participation Badges */}
          <Text style={styles.categoryTitle}>🎯 Participation</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.type === "participation").map((badge) => {
              const earned = isBadgeEarned(badge.id);
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeCircle,
                      {
                        backgroundColor: earned ? badge.backgroundColor : "#f3f4f6",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={badge.icon as any}
                      size={28}
                      color={earned ? badge.color : "#9ca3af"}
                    />
                    {!earned && (
                      <View style={styles.lockOverlay}>
                        <FontAwesome5 name="lock" size={16} color="#6b7280" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeName, !earned && styles.unearnedText]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              );
            })}
          </View>

          {/* Achievement Badges */}
          <Text style={styles.categoryTitle}>🏆 Achievements</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.type === "achievement").map((badge) => {
              const earned = isBadgeEarned(badge.id);
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeCircle,
                      {
                        backgroundColor: earned ? badge.backgroundColor : "#f3f4f6",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={badge.icon as any}
                      size={28}
                      color={earned ? badge.color : "#9ca3af"}
                    />
                    {!earned && (
                      <View style={styles.lockOverlay}>
                        <FontAwesome5 name="lock" size={16} color="#6b7280" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeName, !earned && styles.unearnedText]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    padding: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary.yellow,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 16,
    marginTop: 8,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  badgeCard: {
    width: "30%",
    alignItems: "center",
  },
  badgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  lockOverlay: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "white",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  badgeName: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: 4,
  },
  unearnedText: {
    color: "#9ca3af",
  },
  badgeDescription: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: "center",
  },
  bottomSpacer: {
    height: 40,
  },
});
