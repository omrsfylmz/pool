import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { DashboardHeader } from "../components/ui/DashboardHeader";
import { MedalCase, type Medal } from "../components/ui/MedalCase";
import { DailyChallenge } from "../components/ui/DailyChallenge";
import { PastPolls, type Poll } from "../components/ui/PastPolls";
import { FloatingActionButton } from "../components/ui/FloatingActionButton";
import { BottomNav, type NavItem } from "../components/ui/BottomNav";
import { colors } from "../constants/theme";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavItem>("home");

  // Sample data - replace with real data later
  const medals: Medal[] = [
    {
      id: "1",
      name: "Burger\nMonster",
      icon: "hamburger",
      status: "earned",
    },
    {
      id: "2",
      name: "Sushi\nSensei",
      icon: "fish",
      status: "available",
      isNew: true,
    },
    {
      id: "3",
      name: "Salad\nSage",
      icon: "leaf",
      status: "locked",
    },
    {
      id: "4",
      name: "Pizza\nParty",
      icon: "pizza-slice",
      status: "locked",
    },
  ];

  const polls: Poll[] = [
    {
      id: "1",
      title: "Tacoville",
      date: "Yesterday • 12:30 PM",
      icon: "utensils",
      iconColor: "taco",
      avatars: ["🦁", "🐼", "🦊"],
    },
    {
      id: "2",
      title: "Pizza Palace",
      date: "Monday • 1:00 PM",
      icon: "pizza-slice",
      iconColor: "pizza",
      avatars: ["🐨", "🦒", "🦁"],
    },
  ];

  const handleNotificationPress = () => {
    // TODO: Implement notification handling
    console.log("Notification pressed");
  };

  const handleFabPress = () => {
    router.push("/create-pool");
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
    if (tab === "profile") {
      router.push("/profile");
    }
    // Home tab is already active
  };

  const handleViewAll = () => {
    // TODO: Implement view all polls navigation
    console.log("View all pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader onNotificationPress={handleNotificationPress} />

        <MedalCase medals={medals} earnedCount={1} />

        <DailyChallenge
          title="Eat 3 times at the Deli"
          current={2}
          total={3}
          nextReward="Sushi Sensei medal"
        />

        <PastPolls polls={polls} onViewAll={handleViewAll} />

        {/* Add padding at bottom for FAB and bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FloatingActionButton onPress={handleFabPress} />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    paddingBottom: 180, // Space for FAB and bottom nav
  },
  bottomSpacer: {
    height: 20,
  },
});

