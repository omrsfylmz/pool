import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { colors, typography, borderRadius } from "../../constants/theme";

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
  placeholder = "Tell everyone why this is the best choice...",
  label = "Small note (Optional)",
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.textarea}
        placeholder={placeholder}
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

