import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../constants/theme";
import { supabase } from "../lib/supabase";
import { getFoodOptions, getVotesForPool, type FoodOption } from "../services/api";

interface WinnerData {
  foodOption: FoodOption;
  voteCount: number;
  voters: string[];
}

export default function Winner() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [allOptions, setAllOptions] = useState<Array<FoodOption & { voteCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voterAvatars, setVoterAvatars] = useState<string[]>([]);

  useEffect(() => {
    async function loadResults() {
      if (!poolId) {
        router.replace("/dashboard");
        return;
      }

      try {
        const [foodOptions, votes] = await Promise.all([
          getFoodOptions(poolId),
          getVotesForPool(poolId),
        ]);

        // Calculate vote counts for each option
        const optionsWithVotes = foodOptions.map((option: FoodOption) => {
          const voteCount = votes.filter((v: any) => v.food_option_id === option.id).length;
          return { ...option, voteCount };
        });

        // Sort by vote count
        optionsWithVotes.sort((a: any, b: any) => b.voteCount - a.voteCount);

        // Get winner (most votes)
        if (optionsWithVotes.length > 0 && optionsWithVotes[0].voteCount > 0) {
          const winningOption = optionsWithVotes[0];
          
          setWinner({
            foodOption: winningOption,
            voteCount: winningOption.voteCount,
            voters: [],
          });
        }

        setAllOptions(optionsWithVotes);
        setTotalVotes(votes.length);

        // Fetch voter profiles to get their avatars
        const uniqueVoterIds = [...new Set(votes.map((v: any) => v.user_id))];
        const voterProfiles = await Promise.all(
          uniqueVoterIds.map(async (userId: string) => {
            try {
              const { data } = await supabase
                .from("profiles")
                .select("avatar_animal")
                .eq("id", userId)
                .single();
              return data?.avatar_animal || "🦊";
            } catch {
              return "🦊";
            }
          })
        );
        setVoterAvatars(voterProfiles);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [poolId]);

  const handleBackToDashboard = () => {
    router.replace("/dashboard");
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

  const runnerUp = allOptions.length > 1 ? allOptions[1] : null;
  const isTie = winner && runnerUp && winner.voteCount === runnerUp.voteCount;

  // Use real voter avatars
  const visibleVoters = voterAvatars.slice(0, 4);
  const remainingCount = Math.max(0, voterAvatars.length - visibleVoters.length);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleBackToDashboard}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('results.resultsBreakdown')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Winner Hero Section */}
        {winner ? (
          <View style={styles.heroSection}>
            <View style={styles.winnerBanner}>
              <Text style={styles.winnerBannerText}>{t('winner.winnerBanner')}</Text>
            </View>
            <Text style={styles.heroTitle}>{winner.foodOption.name.toUpperCase()}!</Text>
            <Text style={styles.heroSubtitle}>{t('winner.officeSpoken')}</Text>
          </View>
        ) : (
          <View style={styles.noWinnerSection}>
            <Text style={styles.noWinnerEmoji}>🤷</Text>
            <Text style={styles.noWinnerText}>{t('winner.noWinner.title')}</Text>
            <Text style={styles.noWinnerSubtext}>{t('winner.noWinner.subtitle')}</Text>
          </View>
        )}

        {/* Vote Breakdown Header */}
        {allOptions.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('winner.voteBreakdown')}</Text>
              <View style={styles.totalVotesBadge}>
                <Text style={styles.totalVotesText}>{t('winner.totalVotes', { count: totalVotes })}</Text>
              </View>
            </View>

            {/* Vote Cards */}
            {allOptions.map((option, index) => {
              const isWinner = index === 0;
              const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
              
              return (
                <View key={option.id} style={[styles.voteCard, isWinner && styles.voteCardWinner]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                      <FontAwesome5 
                        name={option.icon || "utensils"} 
                        size={24} 
                        color={isWinner ? colors.primary.yellow : colors.text.grey} 
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{option.name}</Text>
                      {isWinner && <Text style={styles.winningLabel}>{t('winner.winningChoice')}</Text>}
                    </View>
                    <View style={styles.voteCount}>
                      <Text style={styles.voteCountNumber}>{option.voteCount}</Text>
                      <Text style={styles.voteCountLabel}>{t('vote.votes')}</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressTrack}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: isWinner ? colors.primary.yellow : "#8e9aaf"
                        }
                      ]} 
                    />
                  </View>

                  {/* Tie-breaker Alert */}
                  {isWinner && isTie && runnerUp && (
                    <View style={styles.tieAlert}>
                      <Text style={styles.tieIcon}>🔀</Text>
                      <Text style={styles.tieText}>
                        {t('winner.tieBreaker', { name: runnerUp.name, count: winner.voteCount })}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Participation Section */}
            <View style={styles.participationSection}>
              <Text style={styles.sectionLabel}>{t('winner.whoParticipated')}</Text>
              
              <View style={styles.avatarStack}>
                {visibleVoters.map((emoji, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.avatar,
                      { backgroundColor: ["#d1f4ff", "#e2f0cb", "#ffd1dc", "#fff9db"][index % 4] }
                    ]}
                  >
                    <Text style={styles.avatarEmoji}>{emoji}</Text>
                  </View>
                ))}
                {remainingCount > 0 && (
                  <View style={[styles.avatar, styles.moreCount]}>
                    <Text style={styles.moreCountText}>+{remainingCount}</Text>
                    <Text style={styles.moreCountLabel}>{t('winner.more')}</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToDashboard}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{t('winner.backButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  closeButton: {
    width: 36,
    height: 36,
    backgroundColor: "#f1f3f5",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 18,
    color: colors.text.dark,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  headerSpacer: {
    width: 36,
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  winnerBanner: {
    backgroundColor: "#fff9db",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  winnerBannerText: {
    color: "#f08c00",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 64,
    fontStyle: "italic",
    fontWeight: "900",
    color: colors.primary.yellow,
    marginVertical: 0,
    letterSpacing: -2,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#5c5f66",
    marginTop: 5,
  },

  // No Winner
  noWinnerSection: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 30,
  },
  noWinnerEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noWinnerText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  noWinnerSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
    letterSpacing: 1,
  },
  totalVotesBadge: {
    backgroundColor: "#e9ecef",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  totalVotesText: {
    fontSize: 10,
    color: "#495057",
    fontWeight: typography.weights.medium,
  },

  // Vote Cards
  voteCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  voteCardWinner: {
    borderColor: "#fff3bf",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  itemIcon: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 2,
  },
  winningLabel: {
    fontSize: 10,
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
  voteCount: {
    alignItems: "flex-end",
  },
  voteCountNumber: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
  },
  voteCountLabel: {
    fontSize: 10,
    color: colors.text.grey,
    textTransform: "uppercase",
  },

  // Progress Bar
  progressTrack: {
    height: 12,
    backgroundColor: "#f1f3f5",
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  // Tie Alert
  tieAlert: {
    backgroundColor: "#fffef2",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff9db",
  },
  tieIcon: {
    fontSize: 16,
  },
  tieText: {
    flex: 1,
    fontSize: 13,
    color: "#5c5f66",
    lineHeight: 18,
  },

  // Participation Section
  participationSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  avatarStack: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
    marginLeft: -15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  moreCount: {
    backgroundColor: "#e9ecef",
  },
  moreCountText: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  moreCountLabel: {
    fontSize: 8,
    color: colors.text.grey,
  },
  viewButton: {
    backgroundColor: "#fff9db",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  viewButtonText: {
    color: colors.primary.yellow,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },

  // Back Button
  backButton: {
    backgroundColor: colors.primary.yellow,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    shadowColor: colors.primary.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
