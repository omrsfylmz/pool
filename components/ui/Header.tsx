import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
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
  title,
  iconName = "utensils",
  iconSize = 24,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <FontAwesome5
        name={iconName}
        size={iconSize}
        color={colors.primary.yellow}
        style={styles.logoIcon}
      />
      <Text style={styles.headerTitle}>{title || t('common.appTitle')}</Text>
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

