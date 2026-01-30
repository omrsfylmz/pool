import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface DashboardHeaderProps {
  onNotificationPress?: () => void;
}

/**
 * DashboardHeader Component
 * Header for the dashboard with logo and notification bell
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNotificationPress,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle}>
          <FontAwesome5 name="paw" size={20} color={colors.primary.yellow} />
        </View>
        <Text style={styles.appTitle}>{t('dashboard.title')}</Text>
      </View>
      <TouchableOpacity onPress={onNotificationPress} activeOpacity={0.7}>
        <FontAwesome5 name="bell" size={20} color={colors.text.dark} />
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

