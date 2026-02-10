import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface NoteTextareaProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
}

/**
 * NoteTextarea Component
 * Textarea for optional notes
 */
export const NoteTextarea: React.FC<NoteTextareaProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
}) => {
  const { t } = useTranslation();
  const displayLabel = label || t('newSuggestion.noteLabel');
  const displayPlaceholder = placeholder || t('newSuggestion.notePlaceholder');
  return (
    <View style={styles.container}>
      {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
      <TextInput
        style={styles.textarea}
        placeholder={displayPlaceholder}
        placeholderTextColor={colors.text.muted}
        multiline
        numberOfLines={4}
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  label: {
    fontWeight: typography.weights.bold,
    fontSize: 15,
    marginBottom: 12,
    color: colors.text.dark,
  },
  textarea: {
    width: "100%",
    height: 100,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
});

