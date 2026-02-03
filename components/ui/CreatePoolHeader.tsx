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
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{t('createPool.title')}</Text>
      </View>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
      </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.main,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    position: "relative",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

