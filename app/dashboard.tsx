import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { BottomNav, type NavItem } from "../components/ui/BottomNav";
import { DailyChallenge } from "../components/ui/DailyChallenge";
import { DashboardHeader } from "../components/ui/DashboardHeader";
import { FloatingActionButton } from "../components/ui/FloatingActionButton";
import { MedalCase, type Medal } from "../components/ui/MedalCase";
import { PastPolls, type Poll } from "../components/ui/PastPolls";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { getActivePool, getPastPolls, type Pool } from "../services/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavItem>("home");
  const [activePool, setActivePool] = useState<Pool | null>(null);
  const [pastPolls, setPastPolls] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading]);

  // Load pool data
  useEffect(() => {
    async function loadPools() {
      if (!user) return;

      try {
        const [active, past] = await Promise.all([
          getActivePool(),
          getPastPolls(5),
        ]);
        
        setActivePool(active);
        setPastPolls(past);
      } catch (error) {
        console.error("Error loading pools:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadPools();
    }
  }, [user, authLoading]);

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  // Sample medals data - will be replaced with real data later
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

  // Convert past pools to Poll format
  const polls: Poll[] = pastPolls.map((pool) => ({
    id: pool.id,
    title: pool.title,
    date: new Date(pool.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    icon: "utensils",
    iconColor: "taco",
    avatars: ["🦁", "🐼", "🦊"], // Will be replaced with real voter avatars later
  }));

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 180, // Space for FAB and bottom nav
  },
  bottomSpacer: {
    height: 20,
  },
});

