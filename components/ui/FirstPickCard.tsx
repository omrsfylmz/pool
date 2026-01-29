import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { colors, shadows, typography } from "../../constants/theme";

interface FirstPickCardProps {
  title: string;
  location: string;
  distance?: string;
  imageUri?: string | ImageSourcePropType;
}

/**
 * FirstPickCard Component
 * Card displaying the first food pick with location info
 */
export const FirstPickCard: React.FC<FirstPickCardProps> = ({
  title,
  location,
  distance,
  imageUri,
}) => {
  const defaultImage = require("../../assets/images/react-logo.png");

  return (
    <View style={styles.container}>
      <View style={styles.sectionLabel}>
        <FontAwesome5 name="utensils" size={15} color={colors.primary.yellow} />
        <Text style={styles.labelText}>First pick added</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodTitle}>{title}</Text>
          <View style={styles.foodMeta}>
            <FontAwesome5
              name="map-marker-alt"
              size={10}
              color={colors.text.disabled}
            />
            <Text style={styles.foodMetaText}>
              {location}
              {distance && ` • ${distance}`}
            </Text>
          </View>
        </View>
        <Image
          source={imageUri || defaultImage}
          style={styles.foodThumb}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 25,
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  labelText: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  card: {
    width: "100%",
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  foodTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
    color: colors.text.dark,
  },
  foodMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodMetaText: {
    fontSize: 13,
    color: colors.text.grey,
  },
  foodThumb: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
});

