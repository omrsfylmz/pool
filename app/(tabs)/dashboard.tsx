import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivePoolsCarousel } from "../../components/ui/ActivePoolsCarousel";
import { DashboardHeader } from "../../components/ui/DashboardHeader";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";

import { PastPolls, type Poll } from "../../components/ui/PastPolls";
import { getAvatarEmoji } from "../../constants/avatars";
import { colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { checkAndEndExpiredPools, getAllActivePools, getPastPolls, getProfile, leavePool, type Pool, type Profile } from "../../services/api";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activePools, setActivePools] = useState<Pool[]>([]);
  const [pastPolls, setPastPolls] = useState<Pool[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading]);

  // Load pool data
  async function loadPools() {
    if (!user) return;

    try {
      // End any expired pools first so they appear in past polls immediately
      await checkAndEndExpiredPools(user.id);

      const [profileData, activePoolsData, pastPollsData] = await Promise.all([
        getProfile(user.id),
        getAllActivePools(user.id),
        getPastPolls(user.id),
      ]);

      setProfile(profileData);
      setActivePools(activePoolsData);
      setPastPolls(pastPollsData);
    } catch (error) {
      console.error("Error loading pools:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPools();
  };

  useFocusEffect(
    useCallback(() => {
      if (!authLoading && user) {
        loadPools();
      }
    }, [user, authLoading])
  );

  if (loading || authLoading) {
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

  // Convert past pools to Poll format (limit to 3 for dashboard)
  const polls: Poll[] = pastPolls.slice(0, 3).map((pool: any) => ({
    id: pool.id,
    title: pool.title,
    date: new Date(pool.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    icon: "silverware-fork-knife",
    iconColor: "taco",
    avatars: (pool.participant_avatars || []).map((avatar: string) => getAvatarEmoji(avatar)),
  }));



  const handleFabPress = () => {
    router.push("/create-pool");
  };

  const handleTimerEnd = async () => {
    // Refresh all pools when any timer ends
    await loadPools();
  };

  const handleDelete = (poolId: string) => {
    Alert.alert(
      t('common.delete'),
      t('dashboard.deleteConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: "cancel",
        },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              // Optimistic update
              setPastPolls((current) => current.filter((p) => p.id !== poolId));
              await leavePool(poolId);
            } catch (error) {
              console.error("Failed to leave pool:", error);
              // Revert optimistic update if failed
              loadPools(); 
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.yellow} />
          }
        >

          <DashboardHeader userName={profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0]} />

          {/* Join Pool Button */}
          <TouchableOpacity
            style={styles.joinPoolButton}
            onPress={() => router.push('/join-room')}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="sign-in-alt" size={16} color={colors.text.dark} />
            <Text style={styles.joinPoolButtonText}>{t('dashboard.joinPool')}</Text>
          </TouchableOpacity>



          <ActivePoolsCarousel
            pools={activePools}
            onPoolPress={(pool) => router.push(pool.status === 'ended' ? `/results?poolId=${pool.id}` : `/vote?poolId=${pool.id}`)}
            onTimerEnd={handleTimerEnd}
          />

          <PastPolls 
            polls={polls} 
            onViewAll={() => router.push("/past-pools")}
            onDelete={handleDelete}
            onPress={(poolId) => router.push(`/results?poolId=${poolId}`)}
            onReactivate={(pool) => {
              const originalPool = pastPolls.find(p => p.id === pool.id);
              if (originalPool) {
                router.push({
                  pathname: "/create-pool",
                  params: {
                    initialTitle: originalPool.title,
                    initialDescription: originalPool.description || "",
                    initialDuration: originalPool.voting_duration_minutes.toString(),
                    reactivateFromId: originalPool.id,
                  },
                });
              }
            }}
          />
        </ScrollView>
      </GestureHandlerRootView>

      <FloatingActionButton onPress={handleFabPress} />
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
    flexGrow: 1,
    paddingBottom: 80, // Space for FAB
  },
  emptyState: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: "dashed",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.dark,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.grey,
    textAlign: "center",
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
});
