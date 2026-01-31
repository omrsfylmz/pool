import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AllBadgesModal } from "../components/ui/AllBadgesModal";
import { BadgesSection, type Badge } from "../components/ui/BadgesSection";
import { BottomNav, type NavItem } from "../components/ui/BottomNav";
import { ChartCard, type ChartData } from "../components/ui/ChartCard";
import { EditProfileButton } from "../components/ui/EditProfileButton";
import { LanguageSelectorModal } from "../components/ui/LanguageSelectorModal";
import { LogoutButton } from "../components/ui/LogoutButton";
import { MenuItem } from "../components/ui/MenuItem";
import { PasswordUpdateModal } from "../components/ui/PasswordUpdateModal";
import { PrivacyPolicyModal } from "../components/ui/PrivacyPolicyModal";
import { ProfileHeader } from "../components/ui/ProfileHeader";
import { ProfileInfo } from "../components/ui/ProfileInfo";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, getUserAchievements, type Profile } from "../services/api";

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<NavItem>("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);

  // Fetch user profile data
  useEffect(() => {
    async function loadProfile() {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }

      // If no user after auth loaded, redirect to login
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const [profileData, achievements] = await Promise.all([
          getProfile(user.id),
          getUserAchievements(user.id),
        ]);
        setProfile(profileData);
        
        console.log('Fetched achievements:', achievements);
        
        // Map achievements to badge IDs
        const badgeIds = achievements.map((a: any) => a.achievement_type);
        console.log('Badge IDs:', badgeIds);
        setEarnedBadgeIds(badgeIds);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, authLoading]);

  // Map earned badge IDs to badge display objects
  const getBadgeDisplay = (badgeId: string): Badge => {
    const badgeMap: { [key: string]: { icon: string; type: "burger" | "salad" | "sun" } } = {
      newcomer: { icon: "user-plus", type: "sun" },
      burger_monster: { icon: "hamburger", type: "burger" },
      salad_sultan: { icon: "leaf", type: "salad" },
      pizza_pro: { icon: "pizza-slice", type: "burger" },
      taco_titan: { icon: "pepper-hot", type: "burger" },
      early_bird: { icon: "sun", type: "sun" },
      consistent_voter: { icon: "check-circle", type: "sun" },
      streak_master: { icon: "fire", type: "burger" },
      pool_creator: { icon: "plus-circle", type: "salad" },
      winner_winner: { icon: "trophy", type: "sun" },
      tie_breaker: { icon: "dice", type: "sun" },
      idea_generator: { icon: "lightbulb", type: "sun" },
    };

    const badge = badgeMap[badgeId] || { icon: "star", type: "sun" };
    return {
      id: badgeId,
      title: badgeId.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      subtitle: "Earned",
      icon: badge.icon,
      type: badge.type,
      earned: true,
    };
  };

  // Get top 3 earned badges for display
  const displayBadges = earnedBadgeIds.slice(0, 3).map(getBadgeDisplay);
  console.log('Display badges:', displayBadges);

  // Sample chart data (will be replaced with real data later)
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
    setShowPasswordModal(true);
  };

  const handlePrivacy = () => {
    setShowPrivacyModal(true);
  };

  const handleLanguage = () => {
    setShowLanguageModal(true);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push("/dashboard");
    }
    // Profile tab is already active
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onSettings={handleSettings} />

        <View style={styles.main}>
          <ProfileInfo
            userName={profile.full_name || profile.avatar_name}
            userEmail={profile.email}
            avatarAnimal={profile.avatar_animal}
            isVerified={true}
          />

          <EditProfileButton onPress={handleEditProfile} />

          <BadgesSection 
            badges={displayBadges} 
            earnedCount={earnedBadgeIds.length} 
            totalCount={12}
            onViewAll={() => setShowBadgesModal(true)}
          />

          <AllBadgesModal
            visible={showBadgesModal}
            onClose={() => setShowBadgesModal(false)}
            earnedBadgeIds={earnedBadgeIds}
          />

          <Text style={styles.sectionTitle}>{t('profile.plateThisWeek')}</Text>
          <View style={styles.chartSpacer} />
          <ChartCard total={5} data={chartData} />

          <Text style={styles.sectionLabel}>{t('profile.accountPrivacy')}</Text>

          <MenuItem
            icon="globe"
            text={t('profile.language')}
            onPress={handleLanguage}
          />
          <MenuItem
            icon="lock"
            text={t('profile.security')}
            onPress={handleSecurity}
          />
          <MenuItem
            icon="shield-alt"
            text={t('profile.privacy')}
            onPress={handlePrivacy}
          />

          <LogoutButton onPress={handleLogout} text={t('profile.logout')} />
        </View>
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Password Update Modal */}
      <PasswordUpdateModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

