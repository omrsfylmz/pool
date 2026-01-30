import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FoodCard, type FoodOption } from "../components/ui/FoodCard";
import { TimerSection } from "../components/ui/TimerSection";
import { VoteHeader } from "../components/ui/VoteHeader";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useRealtimeFoodOptions } from "../hooks/useRealtimeFoodOptions";
import { useRealtimePool } from "../hooks/useRealtimePool";
import { useRealtimeVotes } from "../hooks/useRealtimeVotes";
import { castVote, endPool, getProfile, getUserVote, type Profile } from "../services/api";

export default function Vote() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userVoteId, setUserVoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Real-time subscriptions
  const { votes, loading: votesLoading } = useRealtimeVotes(poolId || null);
  const { pool, loading: poolLoading } = useRealtimePool(poolId || null);
  const { foodOptions, loading: foodOptionsLoading } = useRealtimeFoodOptions(poolId || null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (!user) {
        router.replace("/");
        return;
      }

      if (!poolId) {
        Alert.alert(t('common.error'), t('vote.errors.noPoolId'));
        router.back();
        return;
      }

      try {
        const [profileData, userVoteData] = await Promise.all([
          getProfile(user.id),
          getUserVote(poolId),
        ]);
        
        setProfile(profileData);
        setUserVoteId(userVoteData?.food_option_id || null);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert(t('common.error'), t('vote.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, poolId]);

  // Calculate timer from pool end time
  useEffect(() => {
    if (!pool) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(pool.ends_at).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        // End the pool and navigate to winner page
        if (pool.status === "active") {
          endPool(pool.id)
            .then(() => {
              // Wait a moment before navigating to show the 0:00:00
              setTimeout(() => {
                router.replace(`/winner?poolId=${pool.id}`);
              }, 2000);
            })
            .catch(console.error);
        }
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setHours(h);
      setMinutes(m);
      setSeconds(s);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pool]);



  const handleSearch = () => {
    Alert.alert("Search", t('vote.alerts.search'));
  };

  const handleVote = async (foodId: string) => {
    if (!poolId) return;

    try {
      await castVote(poolId, foodId);
      setUserVoteId(foodId);
    } catch (error: any) {
      console.error("Error casting vote:", error);
      Alert.alert(t('common.error'), error.message || "Failed to cast vote");
    }
  };

  const handleAddIdea = () => {
    if (poolId) {
      router.push(`/new-suggestion?poolId=${poolId}`);
    }
  };

  if (loading || poolLoading || votesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile || !pool) {
    return null;
  }

  // Transform food options to include vote data
  const foodOptionsWithVotes: FoodOption[] = foodOptions.map((option) => {
    const voteData = votes[option.id];
    const voteCount = voteData?.count || 0;
    const voters = voteData?.voters || [];
    
    // Find the option with the most votes
    const maxVotes = Math.max(...Object.values(votes).map(v => v.count || 0), 0);
    const isLeading = voteCount > 0 && voteCount === maxVotes;

    return {
      id: option.id,
      name: option.name,
      description: option.description || "",
      icon: option.icon,
      voteCount,
      voters,
      isLeading,
      hasVoted: userVoteId === option.id,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VoteHeader userAvatar={profile.avatar_animal} onSearch={handleSearch} />

        <TimerSection hours={hours} minutes={minutes} seconds={seconds} />

        <View style={styles.main}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{pool.title}</Text>
            <Text style={styles.listSubtitle}>
              {pool.description || t('vote.subtitle.default')}
            </Text>
          </View>

          {foodOptionsWithVotes.map((food) => (
            <View key={food.id} style={styles.foodCardWrapper}>
              <FoodCard food={food} onVote={handleVote} />
            </View>
          ))}

          {foodOptionsWithVotes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('vote.emptyState')}</Text>
            </View>
          )}

          <Text style={styles.footerHint}>
            {t('vote.footerHint')}
          </Text>
        </View>
      </ScrollView>
      
      {/* Floating Add Idea Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleAddIdea}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingButtonText}>{t('vote.addIdeaButton')}</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  main: {
    paddingHorizontal: 20,
  },
  listHeader: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
    color: colors.text.dark,
  },
  listSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
  footerHint: {
    textAlign: "center",
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    marginTop: 10,
    opacity: 0.8,
  },
  foodCardWrapper: {
    position: "relative",
  },
  addIdeaWrapper: {
    marginTop: -20,
    marginBottom: 10,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
    marginBottom: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  floatingButton: {
    backgroundColor: colors.primary.yellow,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
