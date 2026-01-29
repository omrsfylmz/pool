import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "../../constants/theme";

interface IdentityDisplayProps {
  identityName: string;
  subtitle?: string;
  description?: string;
}

/**
 * IdentityDisplay Component
 * Displays the anonymous identity information
 */
export const IdentityDisplay: React.FC<IdentityDisplayProps> = ({
  identityName,
  subtitle = "This is your anonymous identity for today's lunch vote.",
  description = "Everyone will see you as this animal. Your real name stays a secret!",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.identityTitle}>{identityName}</Text>
      <Text style={styles.identitySubtitle}>{subtitle}</Text>
      <Text style={styles.identityDesc}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 50,
  },
  identityTitle: {
    fontSize: 36,
    fontWeight: typography.weights.bold,
    marginBottom: 15,
    color: colors.text.dark,
    textAlign: "center",
  },
  identitySubtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginBottom: 15,
    color: colors.text.dark,
    lineHeight: 25,
    textAlign: "center",
  },
  identityDesc: {
    fontSize: 15,
    color: colors.text.grey,
    lineHeight: 22,
    maxWidth: 320,
    textAlign: "center",
  },
});

