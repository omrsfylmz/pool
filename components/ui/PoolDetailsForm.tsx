import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";
import { DurationSelector } from "./DurationSelector";

interface PoolDetailsFormProps {
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onDurationChange?: (duration: number) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialDuration?: number | null;
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
  initialDuration,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const { t } = useTranslation();

  // Sync with external updates (e.g. from reactivating a pool)
  React.useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  React.useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('createPool.details.title')}</Text>
      <Text style={styles.sectionSubtitle}>
        {t('createPool.details.subtitle')}
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('createPool.form.titleLabel')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('createPool.form.titlePlaceholder')}
          placeholderTextColor={colors.text.muted}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            onTitleChange?.(text);
          }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('createPool.form.descriptionLabel')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={t('createPool.form.descriptionPlaceholder')}
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
        <Text style={styles.label}>{t('createPool.form.durationLabel')}</Text>
        <Text style={styles.inputSubLabel}>
          {t('createPool.form.durationSubLabel')}
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

