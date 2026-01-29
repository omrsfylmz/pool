import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { colors, typography, borderRadius, shadows } from "../../constants/theme";

interface QRCodeAreaProps {
  qrCodeUri?: string | ImageSourcePropType;
  description?: string;
}

/**
 * QRCodeArea Component
 * Displays QR code frame with description
 */
export const QRCodeArea: React.FC<QRCodeAreaProps> = ({
  qrCodeUri,
  description = "Or let others scan this code to join",
}) => {
  const defaultImage = require("../../assets/images/react-logo.png");

  return (
    <View style={styles.container}>
      <View style={styles.qrFrame}>
        <Image
          source={qrCodeUri || defaultImage}
          style={styles.qrImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.qrText}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },
  qrFrame: {
    backgroundColor: colors.background.card,
    padding: 15,
    borderRadius: borderRadius.md,
    ...shadows.card,
    borderWidth: 2,
    borderColor: colors.pill.lightYellow,
    marginBottom: 15,
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  qrText: {
    color: colors.text.grey,
    fontSize: typography.sizes.sm,
  },
});

