import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, typography } from "../../constants/theme";

export type NavItem = "home" | "profile";

interface BottomNavProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: string;
}

const navItems: NavItemConfig[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "profile", label: "Profile", icon: "user" },
];

/**
 * BottomNav Component
 * Bottom navigation bar for the app
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onTabChange(item.id)}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name={item.icon}
              size={22}
              color={isActive ? colors.primary.yellow : colors.text.disabled}
            />
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.background.card,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border.veryLight,
    paddingBottom: 10,
    zIndex: 9,
  },
  navItem: {
    alignItems: "center",
    gap: 6,
  },
  navLabel: {
    fontSize: 11,
    color: colors.text.disabled,
  },
  navLabelActive: {
    color: colors.primary.yellow,
  },
});

