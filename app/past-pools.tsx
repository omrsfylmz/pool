import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAvatarEmoji } from "../constants/avatars";
import { borderRadius, colors, shadows, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { getPastPolls, type Pool } from "../services/api";

export default function PastPools() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPools() {
      if (!user) return;

      try {
        // Load all past pools (no limit)
        const pastPools = await getPastPolls(user.id, 100);
        setPools(pastPools);
      } catch (error) {
        console.error("Error loading past pools:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPools();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="chevron-left" size={20} color={colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('pastPools.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pools.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="history" size={64} color={colors.text.grey} />
            <Text style={styles.emptyTitle}>{t('pastPools.emptyTitle')}</Text>
            <Text style={styles.emptyText}>
              {t('pastPools.emptyText')}
            </Text>
          </View>
        ) : (
          <View style={styles.poolsList}>
            {pools.map((pool) => (
              <TouchableOpacity
                key={pool.id}
                style={styles.poolCard}
                onPress={() => router.push(`/results?poolId=${pool.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.poolHeader}>
                  <View style={styles.poolIcon}>
                    <FontAwesome5
                      name="utensils"
                      size={20}
                      color={colors.primary.yellow}
                    />
                  </View>
                  <View style={styles.poolInfo}>
                    <Text style={styles.poolTitle} numberOfLines={1}>
                      {pool.title}
                    </Text>
                    <Text style={styles.poolDate}>
                      {new Date(pool.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color={colors.text.grey}
                  />
                </View>

                {pool.description && (
                  <Text style={styles.poolDescription} numberOfLines={2}>
                    {pool.description}
                  </Text>
                )}

                <View style={styles.poolFooter}>
                  <View style={styles.statusBadge}>
                    <FontAwesome5
                      name="check-circle"
                      size={12}
                      color={colors.status.success}
                    />
                    <Text style={styles.statusText}>{t('pastPools.ended')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    {((pool as any).participant_avatars || []).slice(0, 3).map((avatar: string, index: number) => (
                      <View key={index} style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.background.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: -8,
                        borderWidth: 2,
                        borderColor: colors.background.card,
                        zIndex: 3 - index,
                      }}>
                        <Text style={{ fontSize: 12 }}>{getAvatarEmoji(avatar)}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    style={styles.reactivateButton}
                    onPress={() => {
                      router.push({
                        pathname: "/create-pool",
                        params: {
                          initialTitle: pool.title,
                          initialDescription: pool.description || "",
                          initialDuration: pool.voting_duration_minutes.toString(),
                          reactivateFromId: pool.id,
                        },
                      });
                    }}
                  >
                    <FontAwesome5 name="redo" size={12} color={colors.primary.yellow} />
                    <Text style={styles.reactivateText}>{t('pastPools.reactivate')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    textAlign: "center",
  },
  poolsList: {
    gap: 12,
  },
  poolCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    marginBottom: 12,
    ...shadows.card,
  },
  poolHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  poolIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  poolInfo: {
    flex: 1,
  },
  poolTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  poolDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
  },
  poolDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    marginBottom: 12,
    lineHeight: 20,
  },
  poolFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.status.success,
    fontWeight: typography.weights.medium,
  },
  poolCode: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    fontWeight: typography.weights.medium,
  },
  reactivateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.primary.yellowLight,
    borderRadius: borderRadius.sm,
  },
  reactivateText: {
    fontSize: typography.sizes.xs,
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
});
