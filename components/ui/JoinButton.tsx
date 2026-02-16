import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, shadows, typography } from "../../constants/theme";

interface JoinButtonProps {
  onPress?: () => void;
  text?: string;
  disabled?: boolean;
}

/**
 * JoinButton Component
 * Primary button for joining the room
 */
export const JoinButton: React.FC<JoinButtonProps> = ({
  onPress,
  text = "Join Room",
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
      <FontAwesome5 name="arrow-right" size={16} color={colors.text.dark} />
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
    gap: 10,
    ...shadows.primaryButton,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
