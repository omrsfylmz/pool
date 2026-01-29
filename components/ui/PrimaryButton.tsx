import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface PrimaryButtonProps {
  onPress?: () => void;
  text: string;
  disabled?: boolean;
}

/**
 * PrimaryButton Component
 * Primary action button with yellow background
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  text,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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

