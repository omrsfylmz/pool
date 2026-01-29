import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius, shadows } from "../../constants/theme";

interface IconCardProps {
  icons?: string[];
  iconSize?: number;
  iconColor?: string;
}

/**
 * IconCard Component
 * Displays a card with a grid of food-related icons
 */
export const IconCard: React.FC<IconCardProps> = ({
  icons = ["paw", "hamburger", "carrot", "pizza-slice", "seedling", "bread-slice"],
  iconSize = 42,
  iconColor = colors.primary.yellow,
}) => {
  return (
    <View style={styles.iconCard}>
      <View style={styles.iconGrid}>
        {icons.map((iconName, index) => (
          <FontAwesome5
            key={index}
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCard: {
    backgroundColor: colors.background.card,
    width: "100%",
    height: 320,
    borderRadius: borderRadius.lg,
    ...shadows.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    width: "100%",
  },
});

