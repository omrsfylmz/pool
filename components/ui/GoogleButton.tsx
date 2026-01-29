import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { GoogleIcon } from "../icons/GoogleIcon";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface GoogleButtonProps {
  onPress?: () => void;
  text?: string;
  disabled?: boolean;
}

/**
 * GoogleButton Component
 * Button for signing up with Google
 */
export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  text = "Sign Up with Google",
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <GoogleIcon size={20} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    ...shadows.button,
    gap: 12,
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

