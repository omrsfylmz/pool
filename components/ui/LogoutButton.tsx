import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface LogoutButtonProps {
  onPress: () => void;
  text?: string;
}

/**
 * LogoutButton Component
 * Logout button with red styling
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress, text = "Log Out" }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FontAwesome5 name="sign-out-alt" size={20} color={colors.status.error} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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

