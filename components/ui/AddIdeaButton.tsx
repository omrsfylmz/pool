import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius, shadows, typography } from "../../constants/theme";

interface AddIdeaButtonProps {
  onPress?: () => void;
  text?: string;
}

/**
 * AddIdeaButton Component
 * Button for adding a new food idea, positioned between image and card body
 */
export const AddIdeaButton: React.FC<AddIdeaButtonProps> = ({
  onPress,
  text = "Add Your Idea",
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome5 name="circle-plus" size={16} color={colors.text.dark} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "90%",
    alignSelf: "center",
    marginTop: -20,
    marginBottom: 10,
    backgroundColor: colors.primary.yellow,
    padding: 14,
    borderRadius: borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    zIndex: 10,
    ...shadows.primaryButton,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

