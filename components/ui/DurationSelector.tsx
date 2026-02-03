import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

export type DurationOption = {
  value: number;
  unit: "sec" | "min" | "hour";
  label: string;
};

interface DurationSelectorProps {
  options?: DurationOption[];
  selectedValue?: number | null;
  onSelect?: (value: number) => void;
}

const defaultOptions: DurationOption[] = [
  { value: 0.5, unit: "sec", label: "30 sec" },
  { value: 5, unit: "min", label: "5 min" },
  { value: 15, unit: "min", label: "15 min" },
  { value: 30, unit: "min", label: "30 min" },
];

/**
 * DurationSelector Component
 * Grid of duration options for voting duration
 */
export const DurationSelector: React.FC<DurationSelectorProps> = ({
  options = defaultOptions,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map((option) => {
          const isActive = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, styles.optionWrapper, isActive && styles.optionActive]}
              onPress={() => onSelect?.(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.durationLabel,
                  isActive && styles.durationLabelActive,
                ]}
              >
                {option.label}
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
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  optionWrapper: {
     flexBasis: '45%'
  },
  optionActive: {
    backgroundColor: colors.primary.yellow,
    borderColor: colors.primary.yellow,
    ...shadows.primaryButton,
  },
  durationLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  durationLabelActive: {
    color: colors.background.card,
  },
});

