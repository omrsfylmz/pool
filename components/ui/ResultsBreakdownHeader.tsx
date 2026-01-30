import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, shadows, typography } from "../../constants/theme";

interface ResultsBreakdownHeaderProps {
  onClose?: () => void;
}

/**
 * ResultsBreakdownHeader Component
 * Header with close button in circular white background
 */
export const ResultsBreakdownHeader: React.FC<ResultsBreakdownHeaderProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.closeButton}
      >
        <FontAwesome5 name="times" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('headers.resultsBreakdown')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

