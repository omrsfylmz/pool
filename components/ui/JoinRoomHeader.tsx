import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { typography, colors } from "../../constants/theme";

interface JoinRoomHeaderProps {
  onClose?: () => void;
}

/**
 * JoinRoomHeader Component
 * Header for the join room page with close button
 */
export const JoinRoomHeader: React.FC<JoinRoomHeaderProps> = ({
  onClose,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        style={styles.closeButton}
      >
        <FontAwesome5 name="times" size={24} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Join Room</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 24,
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});

