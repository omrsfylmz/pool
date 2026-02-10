import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface LiveResultsHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onInfo?: () => void;
}

/**
 * LiveResultsHeader Component
 * Header with live indicator dot, title, and info button
 */
export const LiveResultsHeader: React.FC<LiveResultsHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onInfo,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t('results.live');
  const displaySubtitle = subtitle || t('headers.voteSubtitle');
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <View style={styles.headerTitleRow}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>{displayTitle}</Text>
        </View>
        <Text style={styles.headerSubtitle}>{displaySubtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={onInfo}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="info-circle" size={20} color={colors.text.dark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconButton: {
    padding: 5,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: "#ff4757",
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
  },
});

