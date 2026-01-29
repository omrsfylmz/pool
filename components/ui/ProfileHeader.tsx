import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { typography, colors, shadows } from "../../constants/theme";

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
  avatarUri?: string | ImageSourcePropType;
  isVerified?: boolean;
  onSettings?: () => void;
}

/**
 * ProfileHeader Component
 * Header with profile title and settings button
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSettings,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Profile</Text>
      <TouchableOpacity
        onPress={onSettings}
        activeOpacity={0.7}
        style={styles.settingsButton}
      >
        <FontAwesome5 name="cog" size={20} color={colors.text.dark} />
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  settingsButton: {
    padding: 5,
  },
});

