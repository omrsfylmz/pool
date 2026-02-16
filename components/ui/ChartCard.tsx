import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

export interface ChartData {
  label: string;
  percentage: number;
  color: string;
}

interface ChartCardProps {
  total: number;
  data: ChartData[];
}

/**
 * ChartCard Component
 * Donut chart showing food category breakdown
 */
export const ChartCard: React.FC<ChartCardProps> = ({ total, data }) => {
  const size = 100;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash for each segment
  let currentOffset = 0;
  const segments = data.map((item) => {
    const segmentLength = (item.percentage / 100) * circumference;
    const offset = currentOffset;
    currentOffset += segmentLength;
    return {
      ...item,
      segmentLength,
      offset,
    };
  });

  return (
    <View style={styles.card}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {segments.map((segment, index) => (
            <Circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.segmentLength} ${circumference}`}
              strokeDashoffset={-segment.offset + circumference / 4}
              strokeLinecap="round"
            />
          ))}
        </Svg>
        <View style={styles.chartHole}>
          <Text style={styles.chartTotalLabel}>Total</Text>
          <Text style={styles.chartTotalVal}>{total}</Text>
        </View>
      </View>
      <View style={styles.chartLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
    ...shadows.card,
  },
  chartContainer: {
    width: 100,
    height: 100,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  chartHole: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: colors.background.card,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  chartTotalLabel: {
    fontSize: 10,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },
  chartTotalVal: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  chartLegend: {
    flex: 1,
    paddingLeft: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.dark,
  },
});
