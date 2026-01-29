import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../../constants/theme";

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
        style={styles.backButton}
      >
        <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Join Room</Text>
      <View style={styles.placeholder} />
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginRight: 25,
  },
  placeholder: {
    width: 30,
  },
});

