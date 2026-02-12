import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface HeroCardProps {
  imageUri?: string | ImageSourcePropType;
  successTag?: string;
  poolName: string;
}

/**
 * HeroCard Component
 * Hero image card with overlay showing pool name and success tag
 */
export const HeroCard: React.FC<HeroCardProps> = ({
  imageUri,
  successTag = "Success! Your Pool is Live",
  poolName,
}) => {
  // Default placeholder image
  const defaultImage = require("../../assets/images/splash-icon-new.png");

  return (
    <View style={styles.container}>
      <Image
        source={imageUri || defaultImage}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.successTag}>{successTag}</Text>
        <Text style={styles.poolName}>{poolName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  successTag: {
    color: colors.primary.yellow,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  poolName: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.background.card,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

