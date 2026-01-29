import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "../../constants/theme";

interface NotificationBoxProps {
  title?: string;
  message?: string;
}

/**
 * NotificationBox Component
 * Notification box with title and message
 */
export const NotificationBox: React.FC<NotificationBoxProps> = ({
  title = "Still undecided?",
  message = '"The animals are getting hungry... quick, cast your vote!"',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pill.lightYellow,
    borderRadius: borderRadius.sm,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.pill.borderYellow,
  },
  title: {
    color: colors.primary.yellowDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
    marginBottom: 4,
  },
  message: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    fontStyle: "italic",
    textAlign: "center",
  },
});

