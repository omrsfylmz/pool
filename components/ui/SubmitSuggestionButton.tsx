import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, shadows, typography } from "../../constants/theme";

interface SubmitSuggestionButtonProps {
  onPress?: () => void;
  text?: string;
  disabled?: boolean;
}

/**
 * SubmitSuggestionButton Component
 * CTA button for submitting a suggestion
 */
export const SubmitSuggestionButton: React.FC<SubmitSuggestionButtonProps> = ({
  onPress,
  text,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const displayText = text || t('newSuggestion.submitButton');
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{displayText}</Text>
        <FontAwesome5 name="paper-plane" size={16} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.footerNote}>
        {t('newSuggestion.anonymousNote')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
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
  footerNote: {
    textAlign: "center",
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 0.5,
    fontWeight: typography.weights.medium,
  },
});

