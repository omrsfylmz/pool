import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography } from "../../constants/theme";

interface HeaderProps {
  title?: string;
  iconName?: string;
  iconSize?: number;
}

/**
 * Header Component
 * Displays the app header with logo icon and title
 */
export const Header: React.FC<HeaderProps> = ({
  title = "Lunch Vote",
  iconName = "utensils",
  iconSize = 24,
}) => {
  return (
    <View style={styles.header}>
      <FontAwesome5
        name={iconName}
        size={iconSize}
        color={colors.primary.yellow}
        style={styles.logoIcon}
      />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoIcon: {
    position: "absolute",
    left: 30,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

