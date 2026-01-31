import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface VoteHeaderProps {
  userAvatar?: string;
  onSearch?: () => void;
  onAvatarPress?: () => void;
}

/**
 * VoteHeader Component
 * Header for the vote page with user avatar, title, and search icon
 */
export const VoteHeader: React.FC<VoteHeaderProps> = ({
  userAvatar = "🦁",
  onSearch,
  onAvatarPress,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onAvatarPress}
        activeOpacity={0.7}
        style={styles.userAvatar}
      >
        <Text style={styles.avatarEmoji}>{userAvatar}</Text>
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{t('headers.voteTitle')}</Text>
        <Text style={styles.headerSubtitle}>{t('headers.voteSubtitle')}</Text>
      </View>
      <TouchableOpacity
        onPress={onSearch}
        activeOpacity={0.7}
        style={styles.searchButton}
      >
        <FontAwesome5 name="search" size={20} color={colors.text.dark} />
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
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
    color: colors.text.dark,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
  },
  searchButton: {
    padding: 5,
  },
});

