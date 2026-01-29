import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

interface MenuItemProps {
  icon: string;
  text: string;
  onPress?: () => void;
}

/**
 * MenuItem Component
 * Menu item with icon, text, and arrow
 */
export const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIcon}>
        <FontAwesome5 name={icon as any} size={16} color={colors.primary.yellow} />
      </View>
      <Text style={styles.menuText}>{text}</Text>
      <FontAwesome5 name="chevron-right" size={14} color={colors.text.disabled} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: colors.background.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: borderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    ...shadows.button,
  },
  menuIcon: {
    width: 24,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
  },
});

