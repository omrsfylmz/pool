import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AllBadgesModal } from "../../components/ui/AllBadgesModal";
import { BadgesSection, type Badge } from "../../components/ui/BadgesSection";
// BottomNav removed
import { AvatarSelectionModal } from "../../components/ui/AvatarSelectionModal";
import { LanguageSelectorModal } from "../../components/ui/LanguageSelectorModal";
import { LogoutButton } from "../../components/ui/LogoutButton";
import { MenuItem } from "../../components/ui/MenuItem";
import { PasswordUpdateModal } from "../../components/ui/PasswordUpdateModal";
import { PrivacyPolicyModal } from "../../components/ui/PrivacyPolicyModal";
import { ProfileEditModal } from "../../components/ui/ProfileEditModal";
import { ProfileInfo } from "../../components/ui/ProfileInfo";
import { getAvatarEmoji } from "../../constants/avatars";
import { colors, typography } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { deleteAccount, getProfile, getUserAchievements, updateProfile, type Profile } from "../../services/api";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading, signOut } = useAuth();
  // activeTab state removed
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);

  // Fetch user profile data
  useEffect(() => {
    loadData();
  }, [user, authLoading]);

  async function loadData() {
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
      
      // Map achievements to badge IDs
      const badgeIds = achievements.map((a: any) => a.achievement_type);
      setEarnedBadgeIds(badgeIds);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

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
      subtitle: t('profile.earned'),
      icon: badge.icon,
      type: badge.type,
      earned: true,
    };
  };

  const displayBadges = earnedBadgeIds.map(getBadgeDisplay);

  const handleEditProfile = () => {
    setShowEditProfileModal(true);
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

  const handleDeleteAccount = () => {
      Alert.alert(
        t('profile.deleteAccount'),
        t('profile.deleteConfirmation'),
        [
          { text: t('common.cancel'), style: "cancel" },
          {
            text: t('common.delete'),
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              try {
                await deleteAccount();
                await signOut();
                router.replace("/");
              } catch (error) {
                console.error("Error deleting account:", error);
                Alert.alert(t('common.error'), t('profile.errors.deleteFailed'));
                setLoading(false);
              }
            },
          },
        ]
      );
    };

  const handleAvatarUpdate = async (newAvatar: string) => {
    if (!user) return;
    
    // Optimistic update
    setProfile(prev => prev ? { ...prev, avatar_animal: newAvatar } : null);
    setShowAvatarModal(false);

    try {
      await updateProfile(user.id, { avatar_animal: newAvatar });
      // Reload in background to ensure sync
      loadData(); 
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert(t('common.error'), t('profile.errors.updateFailed'));
      // Revert on error
      loadData();
    }
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

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        </View>
        
        <View style={styles.main}>
          <ProfileInfo
            userName={profile?.full_name || "User"}
            userEmail={profile?.email || ""}
            avatarAnimal={getAvatarEmoji(profile?.avatar_animal)}
            isVerified={true} // Assuming email verified for now
            onEditAvatar={() => setShowAvatarModal(true)}
          />

          <BadgesSection 
            badges={displayBadges} 
            earnedCount={earnedBadgeIds.length}
            totalCount={12}
            onViewAll={() => setShowBadgesModal(true)}
          />
          
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
            <MenuItem
               icon="user-edit"
               text={t('profile.editProfile')}
               onPress={handleEditProfile}
             />
            <MenuItem 
              icon="lock" 
              text={t('profile.security')} 
              onPress={handleSecurity}
            />
            <MenuItem 
              icon="globe" 
              text={t('profile.language')} 
              onPress={handleLanguage}
            />
            <MenuItem 
              icon="shield-alt" 
              text={t('profile.privacy')} 
              onPress={handlePrivacy}
            />
          </View>
          
          <LogoutButton onPress={handleLogout} />

          <View style={styles.dangerZone}>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>{t('profile.deleteAccount')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <PasswordUpdateModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
      
      <AllBadgesModal
        visible={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
        earnedBadgeIds={earnedBadgeIds}
      />
      
      <ProfileEditModal
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        currentName={profile?.full_name || ""}
        onUpdate={loadData}
      />

      <AvatarSelectionModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarUpdate}
        currentAvatar={profile?.avatar_animal || undefined}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.background.main,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
  },
  menuSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 16,
    marginLeft: 4,
  },
  dangerZone: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  deleteButton: {
    padding: 12,
  },
  deleteButtonText: {
    color: colors.status.error,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
});
