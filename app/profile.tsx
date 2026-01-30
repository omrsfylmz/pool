import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { getProfile, type Profile } from "../services/api";

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
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, authLoading]);

  // Sample badges (will be replaced with real data later)
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

          <BadgesSection badges={badges} earnedCount={6} totalCount={12} />

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

