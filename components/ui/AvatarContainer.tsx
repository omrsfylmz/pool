import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { colors, shadows } from "../../constants/theme";

interface AvatarContainerProps {
  imageUri?: string | ImageSourcePropType;
  size?: number;
}

/**
 * AvatarContainer Component
 * Large circular avatar with yellow border frame
 */
export const AvatarContainer: React.FC<AvatarContainerProps> = ({
  imageUri,
  size = 280,
}) => {
  const defaultImage = require("../../assets/images/react-logo.png");
  const innerSize = size - 30; // Account for padding

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={imageUri || defaultImage}
        style={[
          styles.avatarImage,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 140,
    padding: 15,
    backgroundColor: colors.pill.lightYellow,
    ...shadows.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  avatarImage: {
    borderWidth: 8,
    borderColor: colors.background.card,
  },
});

