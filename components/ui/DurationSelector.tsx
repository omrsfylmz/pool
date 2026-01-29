import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

export type DurationOption = {
  value: number;
  unit: "min" | "hour";
  label: string;
};

interface DurationSelectorProps {
  options?: DurationOption[];
  selectedValue?: number;
  onSelect?: (value: number) => void;
}

const defaultOptions: DurationOption[] = [
  { value: 5, unit: "min", label: "5 min" },
  { value: 10, unit: "min", label: "10 min" },
  { value: 15, unit: "min", label: "15 min" },
  { value: 30, unit: "min", label: "30 min" },
];

/**
 * DurationSelector Component
 * Grid of duration options for voting duration
 */
export const DurationSelector: React.FC<DurationSelectorProps> = ({
  options = defaultOptions,
  selectedValue = 5,
  onSelect,
}) => {
  const [selected, setSelected] = useState(selectedValue);

  const handleSelect = (value: number) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map((option) => {
          const isActive = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.durationVal,
                  isActive && styles.durationValActive,
                ]}
              >
                {option.value}
              </Text>
              <Text
                style={[
                  styles.durationUnit,
                  isActive && styles.durationUnitActive,
                ]}
              >
                {option.unit}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  option: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  optionActive: {
    backgroundColor: colors.primary.yellow,
    borderColor: colors.primary.yellow,
    ...shadows.primaryButton,
  },
  durationVal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
    color: colors.text.dark,
  },
  durationValActive: {
    color: colors.background.card,
  },
  durationUnit: {
    fontSize: typography.sizes.xs,
    color: colors.text.dark,
  },
  durationUnitActive: {
    color: colors.background.card,
  },
});

