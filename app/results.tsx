import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { LiveResultsHeader } from "../components/ui/LiveResultsHeader";
import { TimerCard } from "../components/ui/TimerCard";
import { ResultCard, type ResultItem } from "../components/ui/ResultCard";
import { NotificationBox } from "../components/ui/NotificationBox";
import { ViewAllButton } from "../components/ui/ViewAllButton";
import { colors } from "../constants/theme";

export default function Results() {
  const router = useRouter();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  // Sample results data - sorted by vote count
  const [results] = useState<ResultItem[]>([
    {
      id: "1",
      name: "Thai Spice",
      rank: 1,
      voteCount: 12,
      popularity: 92,
      voters: ["🐘", "🦊", "🐼", "🦁", "🐨", "🦒", "🐻", "🐰", "🦝", "🐸", "🐙", "🐷"],
      isWinner: true,
    },
    {
      id: "2",
      name: "Pizza Palace",
      rank: 2,
      voteCount: 8,
      popularity: 65,
      voters: ["🐸", "🐙", "🐷", "🐨", "🦒", "🐻", "🐰", "🦝"],
    },
    {
      id: "3",
      name: "Salad Station",
      rank: 3,
      voteCount: 3,
      popularity: 22,
      voters: ["🐷", "🐨", "🦒"],
    },
  ]);

  // Timer countdown - navigate to breakdown when finished
  useEffect(() => {
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
  }, [minutes, seconds, router]);

  const handleBack = () => {
    router.back();
  };

  const handleInfo = () => {
    // TODO: Implement info modal
    console.log("Info pressed");
  };

  const handleViewAll = () => {
    // TODO: Implement view all functionality
    console.log("View all pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LiveResultsHeader
          onBack={handleBack}
          onInfo={handleInfo}
        />

        <View style={styles.main}>
          <TimerCard minutes={minutes} seconds={seconds} />

          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}

          <NotificationBox />

          <ViewAllButton
            onPress={handleViewAll}
            text="View All"
            count={12}
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
    paddingBottom: 40,
  },
  main: {
    paddingHorizontal: 20,
  },
});

