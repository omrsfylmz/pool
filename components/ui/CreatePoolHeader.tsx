import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface CreatePoolHeaderProps {
  onClose?: () => void;
  onHelp?: () => void;
}

/**
 * CreatePoolHeader Component
 * Header for the create pool page with close and help buttons
 */
export const CreatePoolHeader: React.FC<CreatePoolHeaderProps> = ({
  onClose,
  onHelp,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('createPool.title')}</Text>
      <TouchableOpacity
        onPress={onHelp}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="question-circle" size={20} color={colors.text.dark} />
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
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

