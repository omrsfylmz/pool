import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, borderRadius } from "../../constants/theme";

interface LocationSearchProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

/**
 * LocationSearch Component
 * Search input for restaurant or address with location icon
 */
export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChangeText,
  placeholder = "Search restaurant or address...",
}) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputIconLeft}>
        <FontAwesome5
          name="location-dot"
          size={18}
          color={colors.primary.yellow}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    position: "relative",
    marginBottom: 15,
  },
  inputIconLeft: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: 16,
    paddingLeft: 45,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
});

