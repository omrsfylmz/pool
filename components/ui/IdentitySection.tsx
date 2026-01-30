import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../constants/theme";

interface IdentitySectionProps {
  identityName?: string;
}

/**
 * IdentitySection Component
 * Displays the anonymous identity avatar and name
 */
export const IdentitySection: React.FC<IdentitySectionProps> = ({
  identityName = "Anonymous Lion",
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <FontAwesome5 name="paw" size={36} color={colors.primary.yellow} />
      </View>
      <Text style={styles.identityText}>
        {t('createPool.identityPrefix')}{" "}
        <Text style={styles.identityName}>{identityName}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  identityText: {
    color: colors.text.grey,
    fontSize: typography.sizes.sm,
  },
  identityName: {
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
});

