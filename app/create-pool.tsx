import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
        Alert.alert("Error", "Failed to load profile");
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
      "Create a Pool",
      "Create a voting pool for your team to decide on lunch! Set a title, description, and how long voting should last."
    );
  };

  const handleStartVoting = async () => {
    if (!poolTitle.trim()) {
      Alert.alert("Error", "Please enter a pool title");
      return;
    }

    setCreating(true);
    try {
      const pool = await createPool(poolTitle, poolDescription, votingDuration);
      
      // Navigate to new suggestion page with pool ID
      router.push(`/new-suggestion?poolId=${pool.id}`);
    } catch (error: any) {
      console.error("Error creating pool:", error);
      Alert.alert("Error", error.message || "Failed to create pool");
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

        <CreatePoolButton
          onPress={handleStartVoting}
          disabled={!isFormValid || creating}
        />
      </ScrollView>
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
    paddingBottom: 30,
  },
});
