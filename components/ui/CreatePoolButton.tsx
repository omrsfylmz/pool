import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, shadows, typography } from "../../constants/theme";

interface CreatePoolButtonProps {
  onPress?: () => void;
  text?: string;
  disabled?: boolean;
}

/**
 * CreatePoolButton Component
 * CTA button for starting the voting pool
 */
export const CreatePoolButton: React.FC<CreatePoolButtonProps> = ({
  onPress,
  text,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const buttonText = text || t('createPool.button');

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
      <FontAwesome5 name="rocket" size={16} color={colors.background.card} />
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
    marginTop: 20,
    ...shadows.primaryButton,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.background.card,
  },
});

