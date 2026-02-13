import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

export interface PreviousSuggestion {
  id: string;
  text: string;
  icon: string;
  creatorId?: string;
}

interface PreviousSuggestionsProps {
  suggestions?: PreviousSuggestion[];
  currentUserId?: string;
  onSelect?: (suggestion: PreviousSuggestion) => void;
  onDelete?: (suggestionId: string) => void;
}

/**
 * PreviousSuggestions Component
 * Displays a list of previous suggestions that can be selected
 */
export const PreviousSuggestions: React.FC<PreviousSuggestionsProps> = ({
  suggestions = [],
  currentUserId,
  onSelect,
  onDelete,
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
        {suggestions.map((suggestion) => {
          const isOwner = currentUserId && suggestion.creatorId === currentUserId;
          
          return (
            <View key={suggestion.id} style={styles.suggestionRow}>
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSelect?.(suggestion)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={(suggestion.icon === 'pizza-slice' ? 'pizza' : suggestion.icon) as any}
                  size={20}
                  color={colors.primary.yellow}
                  style={styles.foodIcon}
                />
                <Text style={styles.suggestionText}>{suggestion.text}</Text>
              </TouchableOpacity>
              
              {isOwner && onDelete && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(suggestion.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.status.error} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    paddingRight: 10,
  },
  suggestionItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  foodIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  suggestionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
  },
  deleteButton: {
    padding: 8,
  },
});

