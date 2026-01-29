import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "../../constants/theme";

interface IdentityBannerProps {
  identityName?: string;
  identityEmoji?: string;
  message?: string;
}

/**
 * IdentityBanner Component
 * Displays the user's anonymous identity with a banner
 */
export const IdentityBanner: React.FC<IdentityBannerProps> = ({
  identityName = "Lion",
  identityEmoji = "🦁",
  message = "Roar! What's for lunch today?",
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>{identityEmoji}</Text>
      </View>
      <View style={styles.bannerText}>
        <Text style={styles.bannerTitle}>You are the {identityName}</Text>
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
  },
  bannerTitle: {
    fontSize: 12,
    color: colors.banner.textYellow,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: typography.weights.bold,
  },
  bannerMessage: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    fontWeight: typography.weights.regular,
  },
});

