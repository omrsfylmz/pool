import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, typography } from "../../constants/theme";
import type { BadgeProgress } from "../../services/badgeService";

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
  badgeProgress: Record<string, BadgeProgress>;
}

// All 10 available badges with updated descriptions
const ALL_BADGES: BadgeDefinition[] = [
  // Welcome Badge
  {
    id: "newcomer",
    icon: "user-plus",
    name: "Newcomer",
    description: "Hesap açıldığında kazanılır",
    type: "achievement",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
  },
  // Food Preference Badges
  {
    id: "burger_monster",
    icon: "hamburger",
    name: "Burger Monster",
    description: "Burger seçeneğine ilk oy",
    type: "food",
    color: "#92400e",
    backgroundColor: "#fef3c7",
  },
  {
    id: "salad_sultan",
    icon: "leaf",
    name: "Salad Sultan",
    description: "Salata seçeneğine ilk oy",
    type: "food",
    color: "#166534",
    backgroundColor: "#dcfce7",
  },
  {
    id: "pizza_pro",
    icon: "pizza-slice",
    name: "Pizza Pro",
    description: "Pizza seçeneğine ilk oy",
    type: "food",
    color: "#991b1b",
    backgroundColor: "#fee2e2",
  },
  {
    id: "taco_titan",
    icon: "pepper-hot",
    name: "Taco Titan",
    description: "Acı biberli seçeneğe ilk oy",
    type: "food",
    color: "#ea580c",
    backgroundColor: "#ffedd5",
  },
  // Participation Badges
  {
    id: "early_bird",
    icon: "sun",
    name: "Early Bird",
    description: "Saat 11:00'den önce oy ver",
    type: "participation",
    color: "#1e40af",
    backgroundColor: "#dbeafe",
  },
  {
    id: "consistent_voter",
    icon: "check-circle",
    name: "Consistent Voter",
    description: "Toplamda 5 oy kullan",
    type: "participation",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
  },
  {
    id: "pool_creator",
    icon: "plus-circle",
    name: "Pool Creator",
    description: "İlk havuzunu oluştur",
    type: "participation",
    color: "#059669",
    backgroundColor: "#d1fae5",
  },
  // Achievement Badges
  {
    id: "winner_winner",
    icon: "trophy",
    name: "Winner Winner",
    description: "Oyun 3 kez birinci olsun",
    type: "achievement",
    color: "#ca8a04",
    backgroundColor: "#fef9c3",
  },
  {
    id: "idea_generator",
    icon: "lightbulb",
    name: "Idea Generator",
    description: "Toplam 5 yemek seçeneği ekle",
    type: "achievement",
    color: "#d97706",
    backgroundColor: "#fef3c7",
  },
];

// Circular progress ring component
function CircularProgress({
  size,
  strokeWidth,
  progress,
  color,
  bgColor,
}: {
  size: number;
  strokeWidth: number;
  progress: number; // 0-1
  color: string;
  bgColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <Svg width={size} height={size} style={styles.progressRing}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress arc */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

export function AllBadgesModal({
  visible,
  onClose,
  earnedBadgeIds,
  badgeProgress,
}: AllBadgesModalProps) {
  const isBadgeEarned = (badgeId: string) => earnedBadgeIds.includes(badgeId);

  const getProgress = (badgeId: string) => {
    const p = badgeProgress[badgeId];
    return p || { current: 0, target: 1 };
  };

  const renderBadge = (badge: BadgeDefinition) => {
    const earned = isBadgeEarned(badge.id);
    const progress = getProgress(badge.id);
    const progressRatio = progress.target > 0 ? progress.current / progress.target : 0;

    return (
      <View key={badge.id} style={styles.badgeCard}>
        <View style={styles.badgeWrapper}>
          {/* SVG circular progress bar */}
          <CircularProgress
            size={82}
            strokeWidth={3.5}
            progress={progressRatio}
            color={earned ? badge.color : "#d1d5db"}
            bgColor={earned ? `${badge.color}20` : "#f3f4f6"}
          />
          {/* Icon in center */}
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
              size={26}
              color={earned ? badge.color : "#9ca3af"}
            />
            {!earned && (
              <View style={styles.lockOverlay}>
                <FontAwesome5 name="lock" size={14} color="#6b7280" />
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.badgeName, !earned && styles.unearnedText]}>
          {badge.name}
        </Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        {/* Progress text */}
        <Text
          style={[
            styles.progressLabel,
            earned && styles.progressLabelEarned,
          ]}
        >
          {earned ? "✓" : `${progress.current}/${progress.target}`}
        </Text>
      </View>
    );
  };

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
            {ALL_BADGES.filter((b) => b.id === "newcomer").map(renderBadge)}
          </View>

          {/* Food Badges */}
          <Text style={styles.categoryTitle}>🍔 Food Preferences</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.type === "food").map(renderBadge)}
          </View>

          {/* Participation Badges */}
          <Text style={styles.categoryTitle}>🎯 Participation</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter((b) => b.type === "participation").map(renderBadge)}
          </View>

          {/* Achievement Badges */}
          <Text style={styles.categoryTitle}>🏆 Achievements</Text>
          <View style={styles.badgesGrid}>
            {ALL_BADGES.filter(
              (b) => b.type === "achievement" && b.id !== "newcomer"
            ).map(renderBadge)}
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
  badgeWrapper: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  progressRing: {
    position: "absolute",
  },
  badgeCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 2,
  },
  unearnedText: {
    color: "#9ca3af",
  },
  badgeDescription: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: "center",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: "#9ca3af",
    textAlign: "center",
  },
  progressLabelEarned: {
    color: "#059669",
  },
  bottomSpacer: {
    height: 40,
  },
});
