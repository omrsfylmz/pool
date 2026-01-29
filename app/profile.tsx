import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ProfileHeader } from "../components/ui/ProfileHeader";
import { ProfileInfo } from "../components/ui/ProfileInfo";
import { EditProfileButton } from "../components/ui/EditProfileButton";
import { BadgesSection, type Badge } from "../components/ui/BadgesSection";
import { ChartCard, type ChartData } from "../components/ui/ChartCard";
import { MenuItem } from "../components/ui/MenuItem";
import { LogoutButton } from "../components/ui/LogoutButton";
import { BottomNav, type NavItem } from "../components/ui/BottomNav";
import { colors, typography } from "../constants/theme";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavItem>("profile");

  // Sample user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.j@officecorp.com",
    avatarUri: undefined, // Can be set to actual image URI
    isVerified: true,
  };

  // Sample badges
  const badges: Badge[] = [
    {
      id: "1",
      title: "Burger Monster",
      subtitle: "3x Burgers/week",
      icon: "hamburger",
      type: "burger",
      earned: true,
    },
    {
      id: "2",
      title: "Salad Sultan",
      subtitle: "Healthy choice",
      icon: "leaf",
      type: "salad",
      earned: true,
    },
    {
      id: "3",
      title: "Early Bird",
      subtitle: "First to vote",
      icon: "sun",
      type: "sun",
      earned: true,
    },
  ];

  // Sample chart data
  const chartData: ChartData[] = [
    { label: "Fast Food", percentage: 45, color: colors.primary.yellow },
    { label: "Healthy", percentage: 30, color: "#fcd072" },
    { label: "Other", percentage: 25, color: "#ffe6ad" },
  ];

  const handleSettings = () => {
    // TODO: Implement settings
    console.log("Settings pressed");
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile
    console.log("Edit profile pressed");
  };

  const handleSecurity = () => {
    // TODO: Implement security settings
    console.log("Security pressed");
  };

  const handlePrivacy = () => {
    // TODO: Implement privacy policy
    console.log("Privacy pressed");
  };

  const handleLogout = () => {
    // TODO: Implement logout
    console.log("Logout pressed");
    // Could navigate back to login
    // router.replace("/");
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push("/dashboard");
    }
    // Profile tab is already active
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onSettings={handleSettings} />

        <View style={styles.main}>
          <ProfileInfo
            userName={userData.name}
            userEmail={userData.email}
            avatarUri={userData.avatarUri}
            isVerified={userData.isVerified}
          />

          <EditProfileButton onPress={handleEditProfile} />

          <BadgesSection badges={badges} earnedCount={6} totalCount={12} />

          <Text style={styles.sectionTitle}>Your Plate This Week</Text>
          <View style={styles.chartSpacer} />
          <ChartCard total={5} data={chartData} />

          <Text style={styles.sectionLabel}>ACCOUNT & PRIVACY</Text>

          <MenuItem
            icon="lock"
            text="Security & Password"
            onPress={handleSecurity}
          />
          <MenuItem
            icon="shield-alt"
            text="Privacy Policy"
            onPress={handlePrivacy}
          />

          <LogoutButton onPress={handleLogout} />
        </View>
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    paddingBottom: 90, // Space for bottom nav
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 10,
  },
  chartSpacer: {
    height: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 5,
  },
});

