import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

export interface PreviousSuggestion {
  id: string;
  text: string;
  emoji: string;
}

interface PreviousSuggestionsProps {
  suggestions?: PreviousSuggestion[];
  onSelect?: (suggestion: PreviousSuggestion) => void;
}

/**
 * PreviousSuggestions Component
 * Displays a list of previous suggestions that can be selected
 */
export const PreviousSuggestions: React.FC<PreviousSuggestionsProps> = ({
  suggestions = [],
  onSelect,
}) => {
  const { t } = useTranslation();
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.suggestionsBox}>
        <View style={styles.suggestionsHeader}>
          <Text style={styles.headerText}>{t('newSuggestion.previousSuggestions')}</Text>
        </View>
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionItem}
            onPress={() => onSelect?.(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.foodIcon}>{suggestion.emoji}</Text>
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  suggestionsBox: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    overflow: "hidden",
  },
  suggestionsHeader: {
    backgroundColor: colors.background.main,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.veryLight,
  },
  headerText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  foodIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  suggestionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
  },
});

