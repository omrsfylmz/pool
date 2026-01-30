import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface NewSuggestionHeaderProps {
  onBack?: () => void;
}

/**
 * NewSuggestionHeader Component
 * Header for the new suggestion page with back button
 */
export const NewSuggestionHeader: React.FC<NewSuggestionHeaderProps> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.backButton}
      >
        <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('headers.newSuggestion')}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginRight: 25, // Offset for back button to center title
  },
  placeholder: {
    width: 30, // Balance the back button width
  },
});

