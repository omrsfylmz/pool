import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface EditProfileButtonProps {
  onPress?: () => void;
  text?: string;
}

/**
 * EditProfileButton Component
 * Button for editing profile
 */
export const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  onPress,
  text = "Edit Profile",
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    padding: 14,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    ...shadows.primaryButton,
  },
  buttonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.background.card,
  },
});

