import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { DurationSelector } from "./DurationSelector";
import { colors, typography, borderRadius } from "../../constants/theme";

interface PoolDetailsFormProps {
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onDurationChange?: (duration: number) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialDuration?: number;
}

/**
 * PoolDetailsForm Component
 * Form for creating a lunch pool with title, description, and duration
 */
export const PoolDetailsForm: React.FC<PoolDetailsFormProps> = ({
  onTitleChange,
  onDescriptionChange,
  onDurationChange,
  initialTitle = "",
  initialDescription = "",
  initialDuration = 5,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pool Details</Text>
      <Text style={styles.sectionSubtitle}>
        Set up your lunch hunt parameters.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pool Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Friday Feast 🍕"
          placeholderTextColor={colors.text.muted}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            onTitleChange?.(text);
          }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Optional: e.g., Walking distance only please!"
          placeholderTextColor={colors.text.muted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            onDescriptionChange?.(text);
          }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Voting Duration</Text>
        <Text style={styles.inputSubLabel}>
          How long should the hunger games last?
        </Text>
        <DurationSelector
          selectedValue={initialDuration}
          onSelect={onDurationChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
    marginBottom: 5,
    color: colors.text.dark,
  },
  sectionSubtitle: {
    color: colors.text.grey,
    fontSize: typography.sizes.sm,
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontWeight: typography.weights.bold,
    fontSize: 15,
    marginBottom: 10,
    color: colors.text.dark,
  },
  inputSubLabel: {
    color: colors.text.grey,
    fontSize: 13,
    marginBottom: 12,
    marginTop: -5,
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
});

