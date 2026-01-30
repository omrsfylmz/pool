import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ResultCard, type ResultItem } from "../components/ui/ResultCard";
import { TimerCard } from "../components/ui/TimerCard";
import { borderRadius, colors, typography } from "../constants/theme";
import { getPoolResults, type PoolResult } from "../services/api";

export default function Results() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const [poolData, setPoolData] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Load pool results
  useEffect(() => {
    async function loadResults() {
      if (!poolId) {
        router.back();
        return;
      }

      try {
        const data = await getPoolResults(poolId);
        setPoolData(data);

        // Calculate remaining time if pool is still active
        if (data.pool.status === "active") {
          const endTime = new Date(data.pool.ends_at).getTime();
          const now = Date.now();
          const remainingMs = endTime - now;

          if (remainingMs > 0) {
            const totalSeconds = Math.floor(remainingMs / 1000);
            setMinutes(Math.floor(totalSeconds / 60));
            setSeconds(totalSeconds % 60);
          }
        }
      } catch (error) {
        console.error("Error loading pool results:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [poolId]);

  // Timer countdown - navigate to breakdown when finished
  useEffect(() => {
    if (!poolData || poolData.pool.status === "ended") return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          return 59;
        }
        // Timer finished - navigate to breakdown
        router.replace("/results-breakdown");
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds, poolData, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  if (!poolData) {
    return null;
  }

  // Convert pool results to ResultItem format
  const results: ResultItem[] = poolData.results.map((result) => ({
    id: result.id,
    name: result.name,
    rank: result.rank,
    voteCount: result.voteCount,
    popularity: poolData.totalVotes > 0 
      ? Math.round((result.voteCount / poolData.totalVotes) * 100)
      : 0,
    icon: result.icon, // Pass the food icon
    voters: [], // We can add voter avatars later if needed
    isWinner: result.isWinner,
  }));

  const isEnded = poolData.pool.status === "ended";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{poolData.pool.title}</Text>
            <Text style={styles.headerSubtitle}>
              {isEnded ? t('results.final') : t('results.live')}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.main}>
          {!isEnded && (
            <TimerCard minutes={minutes} seconds={seconds} />
          )}

          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}

          {/* Custom notification based on pool status */}
          <View style={styles.notificationBox}>
            <View style={styles.notificationIcon}>
              <FontAwesome5 
                name={isEnded ? "check-circle" : "info-circle"} 
                size={20} 
                color={colors.primary.yellow} 
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                {isEnded ? t('results.completed') : t('results.undecided')}
              </Text>
              <Text style={styles.notificationText}>
                {isEnded 
                  ? t('results.endedMessage', { count: poolData.totalVotes })
                  : t('results.activeMessage')
                }
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  main: {
    paddingHorizontal: 20,
  },
  notificationBox: {
    flexDirection: "row",
    backgroundColor: colors.primary.yellowLight,
    borderRadius: borderRadius.md,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  notificationText: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    lineHeight: 18,
  },
});
