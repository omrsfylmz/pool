import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AddIdeaButton } from "../components/ui/AddIdeaButton";
import { FoodCard, type FoodOption } from "../components/ui/FoodCard";
import { TimerSection } from "../components/ui/TimerSection";
import { VoteHeader } from "../components/ui/VoteHeader";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useRealtimePool } from "../hooks/useRealtimePool";
import { useRealtimeVotes } from "../hooks/useRealtimeVotes";
import { castVote, endPool, getFoodOptions, getProfile, getUserVote, type FoodOption as DBFoodOption, type Profile } from "../services/api";

export default function Vote() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [foodOptions, setFoodOptions] = useState<DBFoodOption[]>([]);
  const [userVoteId, setUserVoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Real-time subscriptions
  const { votes, loading: votesLoading } = useRealtimeVotes(poolId || null);
  const { pool, loading: poolLoading } = useRealtimePool(poolId || null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (!user) {
        router.replace("/");
        return;
      }

      if (!poolId) {
        Alert.alert("Error", "No pool ID provided");
        router.back();
        return;
      }

      try {
        const [profileData, foodOptionsData, userVoteData] = await Promise.all([
          getProfile(user.id),
          getFoodOptions(poolId),
          getUserVote(poolId),
        ]);
        
        setProfile(profileData);
        setFoodOptions(foodOptionsData);
        setUserVoteId(userVoteData?.food_option_id || null);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load voting data");
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
    Alert.alert("Search", "Search functionality coming soon!");
  };

  const handleVote = async (foodId: string) => {
    if (!poolId) return;

    try {
      await castVote(poolId, foodId);
      setUserVoteId(foodId);
    } catch (error: any) {
      console.error("Error casting vote:", error);
      Alert.alert("Error", error.message || "Failed to cast vote");
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
              {pool.description || "Select your favorite to win the vote!"}
            </Text>
          </View>

          {foodOptionsWithVotes.map((food, index) => (
            <View key={food.id} style={styles.foodCardWrapper}>
              <FoodCard food={food} onVote={handleVote} />
              {index === 1 && (
                <View style={styles.addIdeaWrapper}>
                  <AddIdeaButton onPress={handleAddIdea} />
                </View>
              )}
            </View>
          ))}

          {foodOptionsWithVotes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No food options yet!</Text>
              <AddIdeaButton onPress={handleAddIdea} />
            </View>
          )}

          <Text style={styles.footerHint}>
            Voters are hidden until the timer ends. 🤫
          </Text>
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
});
