import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface ShareButtonProps {
  onPress?: () => void;
  text?: string;
}

/**
 * ShareButton Component
 * Primary button for sharing the pool link
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  onPress,
  text = "Share Pool Link",
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome5 name="share-nodes" size={16} color={colors.text.dark} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
    ...shadows.primaryButton,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

