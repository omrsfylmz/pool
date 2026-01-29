import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius } from "../../constants/theme";

interface SuggestionInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
}

/**
 * SuggestionInput Component
 * Input field for food suggestions with icon
 */
export const SuggestionInput: React.FC<SuggestionInputProps> = ({
  value,
  onChangeText,
  placeholder = "e.g. Double Cheeseburger",
  label = "What are you craving?",
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.inputIcon}>
          <FontAwesome5 name="utensils" size={18} color={colors.text.muted} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontWeight: typography.weights.bold,
    fontSize: 15,
    marginBottom: 12,
    color: colors.text.dark,
  },
  inputGroup: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: 16,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
});

