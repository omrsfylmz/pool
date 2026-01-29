import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { VoteHeader } from "../components/ui/VoteHeader";
import { TimerSection } from "../components/ui/TimerSection";
import { FoodCard, type FoodOption } from "../components/ui/FoodCard";
import { AddIdeaButton } from "../components/ui/AddIdeaButton";
import { colors, typography } from "../constants/theme";

export default function Vote() {
  const router = useRouter();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(18);

  // Sample food options data
  const [foodOptions, setFoodOptions] = useState<FoodOption[]>([
    {
      id: "1",
      name: "The Classic Burger",
      description: "Angus beef, cheddar, secret sauce, and thick-cut fries.",
      voteCount: 12,
      voters: ["🦊", "🐱", "🐼"],
      isLeading: true,
      hasVoted: false,
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      description: "pepperoni and fresh basil.",
      voteCount: 0,
      hasVoted: false,
    },
    {
      id: "3",
      name: "Sushi Platter",
      description: "Fresh salmon nigiri, tuna rolls, and edamame.",
      voteCount: 5,
      voters: ["🐻"],
      hasVoted: false,
    },
  ]);

  // Timer countdown (simplified - update every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          return 59;
        }
        if (hours > 0) {
          setHours((prev) => prev - 1);
          setMinutes(59);
          return 59;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hours, minutes, seconds]);

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search pressed");
  };

  const handleVote = (foodId: string) => {
    // Update vote state
    setFoodOptions((prev) =>
      prev.map((food) => {
        if (food.id === foodId) {
          return {
            ...food,
            voteCount: food.hasVoted ? food.voteCount - 1 : food.voteCount + 1,
            hasVoted: !food.hasVoted,
          };
        }
        return food;
      })
    );
    // Navigate to results page
    router.push("/results");
  };

  const handleAddIdea = () => {
    // TODO: Navigate to new suggestion page
    console.log("Add idea pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VoteHeader userAvatar="🦁" onSearch={handleSearch} />

        <TimerSection hours={hours} minutes={minutes} seconds={seconds} />

        <View style={styles.main}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Today&apos;s Options</Text>
            <Text style={styles.listSubtitle}>
              Select your favorite to win the vote!
            </Text>
          </View>

          {foodOptions.map((food, index) => (
            <View key={food.id} style={styles.foodCardWrapper}>
              <FoodCard food={food} onVote={handleVote} />
              {index === 1 && (
                <View style={styles.addIdeaWrapper}>
                  <AddIdeaButton onPress={handleAddIdea} />
                </View>
              )}
            </View>
          ))}

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
});

