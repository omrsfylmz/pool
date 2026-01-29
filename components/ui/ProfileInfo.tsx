import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography, shadows } from "../../constants/theme";

interface ProfileInfoProps {
  userName: string;
  userEmail: string;
  avatarUri?: string | ImageSourcePropType;
  isVerified?: boolean;
}

/**
 * ProfileInfo Component
 * Displays user avatar, name, email, and verification badge
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userName,
  userEmail,
  avatarUri,
  isVerified = true,
}) => {
  const defaultImage = require("../../assets/images/react-logo.png");

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Image
          source={avatarUri || defaultImage}
          style={styles.avatarImg}
          resizeMode="cover"
        />
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <FontAwesome5 name="check" size={12} color={colors.background.card} />
          </View>
        )}
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 15,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.background.card,
    ...shadows.button,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 5,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: colors.primary.yellow,
    borderWidth: 2,
    borderColor: colors.background.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
    color: colors.text.dark,
  },
  userEmail: {
    fontSize: 13,
    color: colors.text.grey,
  },
});

