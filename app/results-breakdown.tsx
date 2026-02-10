import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../constants/theme";
import { getPoolResults, type PoolResult } from "../services/api";

export default function ResultsBreakdown() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const [poolData, setPoolData] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      if (!poolId) {
        router.back();
        return;
      }

      try {
        const data = await getPoolResults(poolId);
        setPoolData(data);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [poolId]);

  const handleClose = () => {
    router.back();
  };

  const handleViewAllVoters = () => {
    // TODO: Navigate to voters list

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

  if (!poolData || poolData.results.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{t('winner.noResultsFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const winner = poolData.results[0];
  const runnerUp = poolData.results.length > 1 ? poolData.results[1] : null;
  const isTie = runnerUp && winner.voteCount === runnerUp.voteCount;

  // Get unique voters (mock data for now - will be replaced with real voter data)
  const mockVoters = ["🦊", "🐻", "🐰", "🦁", "🐼", "🐨"];
  const totalVoters = poolData.totalVotes;
  const visibleVoters = mockVoters.slice(0, 4);
  const remainingCount = Math.max(0, totalVoters - visibleVoters.length);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('results.resultsBreakdown')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Winner Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.winnerBanner}>
            <Text style={styles.winnerBannerText}>{t('winner.winnerBanner')}</Text>
          </View>
          <Text style={styles.heroTitle}>{winner.name.toUpperCase()}!</Text>
          <Text style={styles.heroSubtitle}>{t('winner.officeSpoken')}</Text>
        </View>

        {/* Vote Breakdown Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('winner.voteBreakdown')}</Text>
          <View style={styles.totalVotesBadge}>
            <Text style={styles.totalVotesText}>{t('winner.totalVotes', { count: poolData.totalVotes })}</Text>
          </View>
        </View>

        {/* Vote Cards */}
        {poolData.results.map((result, index) => {
          const isWinner = index === 0;
          const percentage = poolData.totalVotes > 0 ? (result.voteCount / poolData.totalVotes) * 100 : 0;
          
          return (
            <View key={result.id} style={[styles.voteCard, isWinner && styles.voteCardWinner]}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemIcon}>{result.icon || "�️"}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{result.name}</Text>
                  {isWinner && <Text style={styles.winningLabel}>{t('winner.winningChoice')}</Text>}
                </View>
                <View style={styles.voteCount}>
                  <Text style={styles.voteCountNumber}>{result.voteCount}</Text>
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

          <TouchableOpacity style={styles.viewButton} onPress={handleViewAllVoters}>
            <Text style={styles.viewButtonText}>{t('winner.viewAllVoters', { count: totalVoters })}</Text>
          </TouchableOpacity>
        </View>
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
  errorText: {
    fontSize: 16,
    color: colors.text.grey,
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
});
