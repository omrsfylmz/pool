import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeroCard } from "../components/ui/HeroCard";
import { IdentityFooter } from "../components/ui/IdentityFooter";
import { ShareButton } from "../components/ui/ShareButton";
import { SharePoolHeader } from "../components/ui/SharePoolHeader";
import { StatusPill } from "../components/ui/StatusPill";
import { colors, typography } from "../constants/theme";
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

  const handleAddFirstOption = () => {
    // Navigate to new suggestion page to add food options
    if (poolId) {
      router.push(`/new-suggestion?poolId=${poolId}`);
    }
  };

  const handleSharePool = async () => {
    if (!poolId || !pool) return;

    try {
      // Generate shareable deep link
      const shareUrl = `firstexpo://vote?poolId=${poolId}`;
      const message = `🍽️ Join my lunch pool: "${pool.title}"!\n\nClick here to vote: ${shareUrl}`;

      await Share.share({
        message,
        title: `Join ${pool.title}`,
      });
    } catch (error: any) {
      console.error("Error sharing pool:", error);
      Alert.alert("Error", "Failed to share pool");
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

          <TouchableOpacity 
            onPress={handleAddFirstOption}
            activeOpacity={0.8}
            style={styles.addOptionButton}
          >
            <View style={styles.addOptionContent}>
              <View style={styles.addOptionTextContainer}>
                <Text style={styles.addOptionTitle}>Add Your First Option</Text>
                <Text style={styles.addOptionSubtitle}>Click here to add food suggestions</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={24} color={colors.primary.yellow} />
            </View>
          </TouchableOpacity>

          <ShareButton onPress={handleSharePool} />

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  addOptionButton: {
    width: "100%",
    borderWidth: 2,
    borderColor: colors.primary.yellow,
    borderRadius: 16,
    borderStyle: "dashed",
    backgroundColor: colors.background.card,
    padding: 20,
    marginBottom: 20,
  },
  addOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addOptionTextContainer: {
    flex: 1,
  },
  addOptionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  addOptionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
});

