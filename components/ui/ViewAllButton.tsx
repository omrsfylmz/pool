import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface ViewAllButtonProps {
  onPress?: () => void;
  text?: string;
  count?: number;
}

/**
 * ViewAllButton Component
 * Button to view all options
 */
export const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  onPress,
  text = "View All",
  count,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        {text} {count && `${count} Options`}
      </Text>
      <FontAwesome5 name="chevron-down" size={16} color={colors.background.card} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
    ...shadows.primaryButton,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.background.card,
  },
});

