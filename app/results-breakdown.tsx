import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ResultsBreakdownHeader } from "../components/ui/ResultsBreakdownHeader";
import { WinnerSection } from "../components/ui/WinnerSection";
import { MapCard } from "../components/ui/MapCard";
import { BreakdownCard, type BreakdownItem } from "../components/ui/BreakdownCard";
import { SlackButton } from "../components/ui/SlackButton";
import { colors } from "../constants/theme";

export default function ResultsBreakdown() {
  const router = useRouter();

  // Sample data - replace with actual results
  const winnerData = {
    name: "PIZZA",
    subtitle: "The Office has spoken! 🍕",
  };

  const restaurantData = {
    name: "Tony's Famous Pizza",
    distance: "0.4 Miles Away",
    walkTime: "15 Min Walk",
  };

  const breakdownItems: BreakdownItem[] = [
    {
      id: "1",
      name: "Pizza",
      emoji: "🍕",
      votes: 12,
      percentage: 43,
      isWinner: true,
    },
    {
      id: "2",
      name: "Sushi",
      emoji: "🍣",
      votes: 12,
      percentage: 43,
      color: "#a29bfe",
    },
    {
      id: "3",
      name: "Burger",
      emoji: "🍔",
      votes: 4,
      percentage: 14,
    },
  ];

  const tieBreaker = {
    message:
      "Won via random tie-breaker against Sushi. Both tied at 12 votes!",
  };

  const voters = [
    "🦊",
    "🐻",
    "🐰",
    "🐼",
    "🦁",
    "🐨",
    "🦒",
    "🐻",
    "🐰",
    "🦝",
    "🐸",
    "🐙",
    "🐷",
    "🐘",
    "🦊",
    "🐻",
    "🐰",
    "🐼",
    "🦁",
    "🐨",
    "🦒",
    "🐻",
    "🐰",
    "🦝",
    "🐸",
    "🐙",
    "🐷",
    "🐘",
  ];

  const handleClose = () => {
    router.back();
  };

  const handleDirections = () => {
    // TODO: Implement directions functionality
    console.log("Directions pressed");
  };

  const handleViewAllVoters = () => {
    // TODO: Implement view all voters
    console.log("View all voters pressed");
  };

  const handleSlackShare = () => {
    // TODO: Implement Slack sharing
    console.log("Share to Slack pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResultsBreakdownHeader onClose={handleClose} />

        <View style={styles.main}>
          <WinnerSection
            winnerName={winnerData.name}
            subtitle={winnerData.subtitle}
          />

          <MapCard
            restaurantName={restaurantData.name}
            distance={restaurantData.distance}
            walkTime={restaurantData.walkTime}
            onDirections={handleDirections}
          />

          <BreakdownCard
            totalVotes={28}
            items={breakdownItems}
            tieBreaker={tieBreaker}
            voters={voters}
            onViewAllVoters={handleViewAllVoters}
          />

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <SlackButton onPress={handleSlackShare} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating button
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: "center",
  },
  spacer: {
    height: 60,
  },
});

