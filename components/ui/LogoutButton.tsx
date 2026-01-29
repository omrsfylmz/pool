import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius, typography } from "../../constants/theme";

interface LogoutButtonProps {
  onPress?: () => void;
  text?: string;
}

/**
 * LogoutButton Component
 * Logout button with red styling
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  onPress,
  text = "Log Out",
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome5
        name="sign-out-alt"
        size={16}
        color="#e02424"
      />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#fff5f5",
    padding: 16,
    borderRadius: borderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: "#e02424",
  },
});

