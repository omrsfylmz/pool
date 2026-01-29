import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { FirstPickCard } from "../components/ui/FirstPickCard";
import { HeroCard } from "../components/ui/HeroCard";
import { IdentityFooter } from "../components/ui/IdentityFooter";
import { QRCodeArea } from "../components/ui/QRCodeArea";
import { ShareButton } from "../components/ui/ShareButton";
import { SharePoolHeader } from "../components/ui/SharePoolHeader";
import { StatusPill } from "../components/ui/StatusPill";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getProfile, type Pool } from "../services/api";

export default function SharePool() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || !poolId) {
        router.replace("/");
        return;
      }

      try {
        const [poolData, profileData] = await Promise.all([
          supabase.from("pools").select("*").eq("id", poolId).single(),
          getProfile(user.id),
        ]);

        if (poolData.error) throw poolData.error;
        
        setPool(poolData.data as Pool);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading pool:", error);
        Alert.alert("Error", "Failed to load pool data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, poolId]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Navigate to new suggestion page to add food options
    if (poolId) {
      router.push(`/new-suggestion?poolId=${poolId}`);
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

  if (!pool || !profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SharePoolHeader onBack={handleBack} />

        <View style={styles.main}>
          <HeroCard
            poolName={pool.title}
            successTag="Success! Your Pool is Live"
          />

          <FirstPickCard
            title="Add Your First Option"
            location="Click below to add food suggestions"
            distance=""
          />

          <ShareButton onPress={handleShare} />

          <QRCodeArea />

          <StatusPill />

          <IdentityFooter
            emoji={profile.avatar_animal}
            identityName={profile.avatar_name}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: "center",
  },
});

