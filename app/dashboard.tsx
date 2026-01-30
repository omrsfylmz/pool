import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomNav, type NavItem } from "../components/ui/BottomNav";
import { DashboardHeader } from "../components/ui/DashboardHeader";
import { FloatingActionButton } from "../components/ui/FloatingActionButton";
import { MedalDisplay } from "../components/ui/MedalDisplay";
import { PastPolls, type Poll } from "../components/ui/PastPolls";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { getActivePool, getPastPolls, getUserAchievements, getUserMedals, type AchievementMedal, type FoodMedal, type Pool } from "../services/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavItem>("home");
  const [activePool, setActivePool] = useState<Pool | null>(null);
  const [pastPolls, setPastPolls] = useState<Pool[]>([]);
  const [medals, setMedals] = useState<FoodMedal[]>([]);
  const [achievements, setAchievements] = useState<AchievementMedal[]>([]);
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
        const [active, past, userMedals, userAchievements] = await Promise.all([
          getActivePool(),
          getPastPolls(5),
          getUserMedals(user.id),
          getUserAchievements(user.id),
        ]);
        
        setActivePool(active);
        setPastPolls(past);
        setMedals(userMedals);
        setAchievements(userAchievements);
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

        {/* Join Pool Button */}
        <TouchableOpacity
          style={styles.joinPoolButton}
          onPress={() => router.push('/join-room')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sign-in-alt" size={16} color={colors.text.dark} />
          <Text style={styles.joinPoolButtonText}>Join Pool with Code</Text>
        </TouchableOpacity>

        <MedalDisplay medals={medals} achievements={achievements} />

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
  joinPoolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.background.card,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.yellow,
    borderStyle: 'dashed',
  },
  joinPoolButtonText: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: colors.text.dark,
  },
  bottomSpacer: {
    height: 20,
  },
});

