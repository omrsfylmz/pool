import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius } from "../../constants/theme";

interface LocationCardProps {
  name: string;
  address: string;
  onChange?: () => void;
}

/**
 * LocationCard Component
 * Displays selected location with change button
 */
export const LocationCard: React.FC<LocationCardProps> = ({
  name,
  address,
  onChange,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.mapIconBox}>
        <FontAwesome5 name="map" size={18} color={colors.text.lightGrey} />
      </View>
      <View style={styles.locDetails}>
        <Text style={styles.locName}>{name}</Text>
        <Text style={styles.locAddress}>{address}</Text>
      </View>
      <TouchableOpacity
        style={styles.changeButton}
        onPress={onChange}
        activeOpacity={0.7}
      >
        <Text style={styles.changeButtonText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.veryLight,
    borderRadius: borderRadius.sm,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  mapIconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.grey,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locDetails: {
    flex: 1,
  },
  locName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 2,
  },
  locAddress: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  changeButton: {
    backgroundColor: colors.primary.yellowLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeButtonText: {
    color: colors.banner.textYellow,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});

