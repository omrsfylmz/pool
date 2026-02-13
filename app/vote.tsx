import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FoodCard, type FoodOption } from "../components/ui/FoodCard";
import { TimerSection } from "../components/ui/TimerSection";
import { VoteHeader } from "../components/ui/VoteHeader";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useRealtimeFoodOptions } from "../hooks/useRealtimeFoodOptions";
import { useRealtimePool } from "../hooks/useRealtimePool";
import { useRealtimeVotes } from "../hooks/useRealtimeVotes";
import { castVote, endPool, getProfile, getUserVote, type Profile } from "../services/api";
import { schedulePoolCompletionNotification } from "../services/NotificationService";

export default function Vote() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userVoteId, setUserVoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const hasNavigated = React.useRef(false);

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
        // End the pool and navigate to winner page (only once)
        if (pool.status === "active" && !hasNavigated.current) {
          hasNavigated.current = true;
          setNavigating(true);
          endPool(pool.id)
            .then(() => {
              setTimeout(() => {
                router.replace(`/winner?poolId=${pool.id}`);
              }, 500);
            })
            .catch((error) => {
              console.error("Error ending pool:", error);
              setNavigating(false);
              hasNavigated.current = false;
            });
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

    // Schedule notification if pool is active
    if (pool.status === "active") {
      schedulePoolCompletionNotification(pool.id, pool.title, pool.ends_at);
    }

    return () => clearInterval(interval);
  }, [pool]);



  // Removed handleSearch

  const handleVote = async (foodId: string) => {
    if (!poolId || !pool) return;

    // Check if pool is expired
    if (pool.status === 'ended' || new Date(pool.ends_at) <= new Date()) {
      Alert.alert(t('common.error'), t('vote.errors.pollEnded') || "This poll has ended");
      return;
    }

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

  const handleCopyCode = async () => {
    if (pool?.join_code) {
      await Clipboard.setStringAsync(pool.join_code);
      Alert.alert(t('common.success'), t('results.copied'));
    }
  };

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

  // Sort by vote count for leaderboard effect
  const sortedOptions = useMemo(() => {
    return [...foodOptionsWithVotes].sort((a, b) => {
      // Primary sort: Vote count (descending)
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      // Secondary sort: Name (alphabetical) for stability
      return a.name.localeCompare(b.name);
    });
  }, [foodOptionsWithVotes]);

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



  return (
    <SafeAreaView style={styles.container}>
      {/* Loading Overlay when navigating */}
      {navigating && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary.yellow} />
            <Text style={styles.loadingText}>{t('vote.loadingResults')}</Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VoteHeader 
          userAvatar={profile.avatar_animal} 
          onAvatarPress={() => router.push('/dashboard')}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.poolTitle}>{pool.title}</Text>
          {pool.description && (
            <Text style={styles.poolDescription}>{pool.description}</Text>
          )}
        </View>

        {/* Join Code Display */}
        {pool?.join_code && (
          <TouchableOpacity 
            style={styles.joinCodeContainer} 
            onPress={handleCopyCode}
            activeOpacity={0.8}
          >
            <View style={styles.joinCodeLabelContainer}>
              <Text style={styles.joinCodeLabel}>{t('results.joinCode')}</Text>
              <FontAwesome5 name="copy" size={12} color={colors.text.grey} style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.joinCodeValue}>{pool.join_code}</Text>
            <Text style={styles.joinCodeHint}>{t('results.copyHint')}</Text>
          </TouchableOpacity>
        )}

        <TimerSection hours={hours} minutes={minutes} seconds={seconds} />

        <View style={styles.main}>


          {sortedOptions.map((food) => (
            <Animated.View 
              key={food.id} 
              layout={LinearTransition.springify().damping(20).mass(1).stiffness(90)}
              style={styles.foodCardWrapper}
            >
              <FoodCard food={food} onVote={handleVote} />
            </Animated.View>
          ))}

          {sortedOptions.length === 0 && (
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 15,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.dark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  main: {
    paddingHorizontal: 20,
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
    color: "#FFF",
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
  joinCodeContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  joinCodeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  joinCodeLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    fontWeight: "500",
  },
  joinCodeValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary.yellow,
    letterSpacing: 4,
    marginVertical: 4,
  },
  joinCodeHint: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  poolTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.dark,
    marginBottom: 8,
  },
  poolDescription: {
    fontSize: 14,
    color: colors.text.grey,
    lineHeight: 20,
  },
});
