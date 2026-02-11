import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface IdentityBannerProps {
  identityEmoji?: string;
  message?: string;
}

/**
 * IdentityBanner Component
 * Displays the user's anonymous identity with a banner
 */
export const IdentityBanner: React.FC<IdentityBannerProps> = ({
  identityEmoji = "🦁",
  message = "Roar! What's for lunch today?",
}) => {
  const { t } = useTranslation(); // Add hook
  return (
    <View style={styles.banner}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>{identityEmoji}</Text>
      </View>
      <View style={styles.bannerText}>
        <Text style={styles.bannerMessage}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.banner.lightYellow,
    borderWidth: 1,
    borderColor: colors.banner.borderYellow,
    borderRadius: borderRadius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary.yellow,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    borderWidth: 3,
    borderColor: colors.background.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
  },
  bannerText: {
    flex: 1,
    justifyContent: "center",
  },
  bannerMessage: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    fontWeight: typography.weights.regular,
  },
});

