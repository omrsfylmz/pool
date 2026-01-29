import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

interface MapCardProps {
  restaurantName: string;
  distance?: string;
  walkTime?: string;
  mapImageUri?: string | ImageSourcePropType;
  onDirections?: () => void;
}

/**
 * MapCard Component
 * Card showing map with restaurant location and details
 */
export const MapCard: React.FC<MapCardProps> = ({
  restaurantName,
  distance = "0.4 Miles Away",
  walkTime = "15 Min Walk",
  mapImageUri,
  onDirections,
}) => {
  const defaultImage = require("../../assets/images/react-logo.png");

  return (
    <View style={styles.card}>
      <View style={styles.mapView}>
        <Image
          source={mapImageUri || defaultImage}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.mapPinTooltip}>
          <Text style={styles.pinText}>{restaurantName}</Text>
          <View style={styles.pinDot} />
        </View>
      </View>
      <View style={styles.mapDetails}>
        <View style={styles.mapTextGroup}>
          <View style={styles.restaurantIcon}>
            <FontAwesome5
              name="utensils"
              size={18}
              color={colors.primary.yellowDark}
            />
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.restaurantMeta}>
              {distance} • {walkTime}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.directionButton}
          onPress={onDirections}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="route" size={18} color={colors.text.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: 25,
    ...shadows.card,
  },
  mapView: {
    height: 180,
    width: "100%",
    backgroundColor: "#eef2f5",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPinTooltip: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: colors.background.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: typography.weights.bold,
    fontSize: 13,
    ...shadows.button,
  },
  pinText: {
    fontWeight: typography.weights.bold,
    fontSize: 13,
    color: colors.text.dark,
  },
  pinDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary.yellow,
    borderWidth: 2,
    borderColor: colors.background.card,
    borderRadius: 6,
    position: "absolute",
    bottom: -20,
    left: "50%",
    transform: [{ translateX: -6 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  mapDetails: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapTextGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  restaurantIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    marginBottom: 3,
    color: colors.text.dark,
  },
  restaurantMeta: {
    fontSize: 11,
    color: colors.text.grey,
    fontWeight: typography.weights.medium,
    textTransform: "uppercase",
  },
  directionButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.light,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

