import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface IdentityFooterProps {
  emoji?: string;
  identityName: string;
}

/**
 * IdentityFooter Component
 * Footer showing user's anonymous identity
 */
export const IdentityFooter: React.FC<IdentityFooterProps> = ({
  emoji = "🦊",
  identityName,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.label}>
        {t('sharePool.yourIdentity')}{" "}
        <Text style={styles.name}>{identityName}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: "auto",
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: colors.background.light,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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
  emoji: {
    fontSize: 24,
  },
  label: {
    color: colors.text.grey,
    fontSize: typography.sizes.xs,
  },
  name: {
    color: colors.text.dark,
    fontWeight: typography.weights.bold,
  },
});

