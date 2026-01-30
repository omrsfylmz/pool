import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, typography } from "../constants/theme";
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
          const winnerVotes = votes.filter((v: any) => v.food_option_id === winningOption.id);
          
          setWinner({
            foodOption: winningOption,
            voteCount: winningOption.voteCount,
            voters: [], // Will be populated with voter avatars later
          });
        }

        setAllOptions(optionsWithVotes);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('winner.calculating')}</Text>
        </View>
      </SafeAreaView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('winner.headerTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('winner.headerSubtitle')}</Text>
        </View>

        {/* Winner Section */}
        {winner ? (
          <View style={styles.winnerSection}>
            <View style={styles.crownContainer}>
              <Text style={styles.crownEmoji}>👑</Text>
            </View>
            <Text style={styles.winnerLabel}>{t('winner.winnerLabel')}</Text>
            <Text style={styles.winnerName}>{winner.foodOption.name}</Text>
            {winner.foodOption.description && (
              <Text style={styles.winnerDescription}>{winner.foodOption.description}</Text>
            )}
            <View style={styles.voteCountBadge}>
              <Ionicons name="heart" size={20} color={colors.primary.yellow} />
              <Text style={styles.voteCountText}>{winner.voteCount} {t('winner.votes')}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noWinnerSection}>
            <Text style={styles.noWinnerEmoji}>🤷</Text>
            <Text style={styles.noWinnerText}>{t('winner.noWinner.title')}</Text>
            <Text style={styles.noWinnerSubtext}>{t('winner.noWinner.subtitle')}</Text>
          </View>
        )}

        {/* All Results */}
        {allOptions.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>{t('winner.allOptions')}</Text>
            {allOptions.map((option, index) => (
              <View key={option.id} style={styles.resultCard}>
                <View style={styles.resultRank}>
                  <Text style={styles.resultRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{option.name}</Text>
                  <Text style={styles.resultVotes}>{option.voteCount} {t('winner.votes')}</Text>
                </View>
                <View style={styles.resultBar}>
                  <View 
                    style={[
                      styles.resultBarFill, 
                      { 
                        width: allOptions[0].voteCount > 0 
                          ? `${(option.voteCount / allOptions[0].voteCount) * 100}%` 
                          : '0%' 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Button */}
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
    backgroundColor: colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
  },
  winnerSection: {
    backgroundColor: colors.primary.yellow,
    borderRadius: borderRadius.lg,
    padding: 32,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  crownContainer: {
    marginBottom: 16,
  },
  crownEmoji: {
    fontSize: 64,
  },
  winnerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: 8,
  },
  winnerDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  voteCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  voteCountText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
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
  resultsSection: {
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  resultRank: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.primary.yellow,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  resultRankText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  resultInfo: {
    marginBottom: 12,
    paddingRight: 40,
  },
  resultName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  resultVotes: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
  resultBar: {
    height: 8,
    backgroundColor: colors.background.main,
    borderRadius: 4,
    overflow: "hidden",
  },
  resultBarFill: {
    height: "100%",
    backgroundColor: colors.primary.yellow,
    borderRadius: 4,
  },
  backButton: {
    backgroundColor: colors.primary.yellow,
    paddingVertical: 16,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
