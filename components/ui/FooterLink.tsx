import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "../../constants/theme";

interface FooterLinkProps {
  text?: string;
  linkText: string;
  onPress?: () => void;
}

/**
 * FooterLink Component
 * Displays footer text with a clickable link
 */
export const FooterLink: React.FC<FooterLinkProps> = ({
  text = "Already have an account?",
  linkText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.footerText}>
        {text}{" "}
        <Text style={styles.linkText} onPress={onPress}>
          {linkText}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    textAlign: "center",
  },
  linkText: {
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
});
