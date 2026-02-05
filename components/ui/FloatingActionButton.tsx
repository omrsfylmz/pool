import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors, shadows } from "../../constants/theme";

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: string;
}

/**
 * FloatingActionButton Component
 * Floating action button for creating new polls
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = "plus",
}) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome5 name={icon} size={28} color={colors.background.card} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: colors.primary.yellow,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.primaryButton,
    zIndex: 10,
  },
});

