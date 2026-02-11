import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAvatarEmoji } from "../../constants/avatars";
import { colors, typography } from "../../constants/theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: "back" | "close" | "avatar";
  onLeftPress?: () => void;
  avatar?: string;
  rightIcon?: string;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftIcon = "back",
  onLeftPress,
  avatar,
  rightIcon,
  onRightPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left Element */}
      <View style={styles.sideElement}>
        {leftIcon === "avatar" && avatar ? (
          <TouchableOpacity
            onPress={onLeftPress}
            activeOpacity={0.7}
            style={styles.userAvatar}
          >
             <Text style={styles.avatarEmoji}>{getAvatarEmoji(avatar)}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onLeftPress}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <FontAwesome5 
              name={leftIcon === "close" ? "times" : "chevron-left"} 
              size={20} 
              color={colors.text.dark} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Element */}
      <View style={styles.centerElement}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right Element */}
      <View style={[styles.sideElement, { alignItems: 'flex-end' }]}>
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <FontAwesome5 name={rightIcon as any} size={20} color={colors.text.dark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.main,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 64,
  },
  sideElement: {
    width: 48,
    justifyContent: 'center',
  },
  centerElement: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    marginTop: 2,
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.background.light,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary.yellow,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
});
