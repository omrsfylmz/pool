import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, shadows, typography } from "../../constants/theme";

interface SlackButtonProps {
  onPress?: () => void;
  text?: string;
}

/**
 * SlackButton Component
 * Floating button for sharing to Slack
 */
export const SlackButton: React.FC<SlackButtonProps> = ({
  onPress,
  text = "SHARE TO SLACK",
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome5 name="slack" size={18} color={colors.background.card} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 30,
    left: "5%",
    right: "5%",
    width: "90%",
    maxWidth: 440,
    backgroundColor: colors.slack.purple,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...shadows.primaryButton,
    zIndex: 100,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.background.card,
  },
});
