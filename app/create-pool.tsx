import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CreatePoolButton } from "../components/ui/CreatePoolButton";
import { CreatePoolHeader } from "../components/ui/CreatePoolHeader";
import { IdentitySection } from "../components/ui/IdentitySection";
import { PoolDetailsForm } from "../components/ui/PoolDetailsForm";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { createPool, getProfile, type Profile } from "../services/api";

export default function CreatePool() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [poolTitle, setPoolTitle] = useState("");
  const [poolDescription, setPoolDescription] = useState("");
  const [votingDuration, setVotingDuration] = useState(60);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert(t('common.error'), t('createPool.errors.loadProfileFailed'));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleClose = () => {
    router.back();
  };

  const handleHelp = () => {
    Alert.alert(
      t('createPool.help.title'),
      t('createPool.help.message')
    );
  };

  const handleStartVoting = async () => {
    if (!poolTitle.trim()) {
      Alert.alert(t('common.error'), t('createPool.errors.missingTitle'));
      return;
    }

    setCreating(true);
    try {
      const pool = await createPool(poolTitle, poolDescription, votingDuration);
      
      // Navigate to share pool page with pool ID
      router.push(`/share-pool?poolId=${pool.id}`);
    } catch (error: any) {
      console.error("Error creating pool:", error);
      Alert.alert(t('common.error'), error.message || t('createPool.errors.creationFailed'));
    } finally {
      setCreating(false);
    }
  };

  const isFormValid = poolTitle.trim().length > 0;

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
        <CreatePoolHeader onClose={handleClose} onHelp={handleHelp} />

        <IdentitySection identityName={profile.avatar_name} />

        <PoolDetailsForm
          onTitleChange={setPoolTitle}
          onDescriptionChange={setPoolDescription}
          onDurationChange={setVotingDuration}
          initialDuration={votingDuration}
        />
      </ScrollView>
      
      <View style={styles.footer}>
        <CreatePoolButton
          onPress={handleStartVoting}
          disabled={!isFormValid || creating}
        />
      </View>
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
    paddingHorizontal: 24,
    paddingBottom: 30, // Reduced padding since button is gone
  },
  footer: {
    padding: 24,
    backgroundColor: colors.background.main,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
});
