import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, shadows, typography } from "../../constants/theme";

interface ProfileInfoProps {
  userName: string;
  userEmail: string;
  avatarUri?: string | ImageSourcePropType;
  avatarAnimal?: string; // Animal emoji like 🦁, 🐼, etc.
  isVerified?: boolean;
  onEditAvatar?: () => void;
}

/**
 * ProfileInfo Component
 * Displays user avatar, name, email, and verification badge
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userName,
  userEmail,
  avatarUri,
  avatarAnimal,
  isVerified = true,
  onEditAvatar,
}) => {
  const defaultImage = require("../../assets/images/splash-icon-new.png");

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <TouchableOpacity 
          style={styles.avatarButton} 
          onPress={onEditAvatar}
          disabled={!onEditAvatar}
          activeOpacity={0.8}
        >
          {avatarAnimal ? (
            <View style={styles.avatarEmoji}>
              <Text style={styles.emojiText}>{avatarAnimal}</Text>
            </View>
          ) : (
            <Image
              source={avatarUri || defaultImage}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          )}
          {onEditAvatar && (
            <View style={styles.editOverlay}>
               <FontAwesome5 name="pen" size={10} color={colors.text.dark} />
            </View>
          )}
        </TouchableOpacity>
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
  avatarButton: {
    position: "relative",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.yellow,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background.card,
    zIndex: 10,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.background.card,
    ...shadows.button,
  },
  avatarEmoji: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.yellowLight,
    borderWidth: 4,
    borderColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  emojiText: {
    fontSize: 40,
  },
  verifiedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: colors.primary.yellow,
    borderWidth: 2,
    borderColor: colors.background.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
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
