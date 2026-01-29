import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { typography, colors } from "../../constants/theme";

interface CreatePoolHeaderProps {
  onClose?: () => void;
  onHelp?: () => void;
}

/**
 * CreatePoolHeader Component
 * Header for the create pool page with close and help buttons
 */
export const CreatePoolHeader: React.FC<CreatePoolHeaderProps> = ({
  onClose,
  onHelp,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="times" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Create Lunch Pool</Text>
      <TouchableOpacity
        onPress={onHelp}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <FontAwesome5 name="question-circle" size={20} color={colors.text.dark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

