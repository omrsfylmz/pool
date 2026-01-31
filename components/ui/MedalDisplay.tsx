import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface AchievementMedal {
  id: string;
  achievement_type: string;
  food_icon: string;
  food_name: string | null;
  earned_at: string;
}

interface MedalDisplayProps {
  achievements: AchievementMedal[];
}

/**
 * MedalDisplay Component
 * Displays user achievements (badges)
 */
export const MedalDisplay: React.FC<MedalDisplayProps> = ({ achievements }) => {
  const { t } = useTranslation();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('dashboard.achievements')}</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementIconContainer}>
              <FontAwesome5
                name={achievement.food_icon as any}
                size={24}
                color={colors.primary.yellow}
              />
            </View>
            <Text style={styles.achievementType}>
              {achievement.achievement_type.replace(/_/g, ' ')}
            </Text>
            {achievement.food_name && (
              <Text style={styles.achievementName}>{achievement.food_name}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 15,
  },
  scrollContent: {
    paddingVertical: 5,
  },
  achievementCard: {
    width: 130,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary.yellow,
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementType: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
    textAlign: "center",
    textTransform: "capitalize",
  },
  achievementName: {
    fontSize: 10,
    color: colors.text.grey,
    textAlign: "center",
  },
});
