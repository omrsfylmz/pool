import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeroCard } from "../components/ui/HeroCard";
import { IdentityFooter } from "../components/ui/IdentityFooter";
import { ShareButton } from "../components/ui/ShareButton";
import { SharePoolHeader } from "../components/ui/SharePoolHeader";
import { StatusPill } from "../components/ui/StatusPill";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getProfile, type Pool } from "../services/api";

export default function SharePool() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || !poolId) {
        router.replace("/");
        return;
      }

      try {
        const [poolData, profileData] = await Promise.all([
          supabase.from("pools").select("*").eq("id", poolId).single(),
          getProfile(user.id),
        ]);

        if (poolData.error) throw poolData.error;
        
        setPool(poolData.data as Pool);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading pool:", error);
        Alert.alert(t('common.error'), t('sharePool.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, poolId]);

  const handleBack = () => {
    router.back();
  };

  const handleCopyCode = async () => {
    if (pool?.join_code) {
      await Clipboard.setStringAsync(pool.join_code);
      Alert.alert(t('common.success'), t('sharePool.copied'));
    }
  };

  const handleAddFirstOption = () => {
    // Navigate to new suggestion page to add food options
    if (poolId) {
      router.push(`/new-suggestion?poolId=${poolId}`);
    }
  };

  const handleSharePool = async () => {
    if (!poolId || !pool) return;

    try {
      // Generate shareable message with join code
      const message = t('sharePool.shareMessage', { title: pool.title, code: pool.join_code });

      await Share.share({
        message,
        title: `Join ${pool.title}`,
      });
    } catch (error: any) {
      console.error("Error sharing pool:", error);
      Alert.alert(t('common.error'), t('sharePool.errors.shareFailed'));
    }
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

  if (!pool || !profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SharePoolHeader onBack={handleBack} />

        <View style={styles.main}>
          <HeroCard
            poolName={pool.title}
            successTag={t('sharePool.successTag')}
            imageUri={require("../assets/images/share-pool-hero-simple.png")}
          />

          {/* Join Code Display - Tap to copy */}
          <TouchableOpacity 
            style={styles.joinCodeContainer}
            onPress={handleCopyCode}
            activeOpacity={0.8}
          >
            <View style={styles.joinCodeLabelRow}>
              <Text style={styles.joinCodeLabel}>{t('sharePool.joinCodeLabel')}</Text>
              <FontAwesome5 name="copy" size={12} color={colors.text.grey} style={{ marginLeft: 6 }} />
            </View>
            <View style={styles.joinCodeBox}>
              <Text style={styles.joinCodeText}>{pool.join_code}</Text>
            </View>
            <Text style={styles.joinCodeHint}>{t('sharePool.copyHint')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleAddFirstOption}
            activeOpacity={0.8}
            style={styles.addOptionButton}
          >
            <View style={styles.addOptionContent}>
              <View style={styles.addOptionTextContainer}>
                <Text style={styles.addOptionTitle}>{t('sharePool.addOptionTitle')}</Text>
                <Text style={styles.addOptionSubtitle}>{t('sharePool.addOptionSubtitle')}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={24} color={colors.primary.yellow} />
            </View>
          </TouchableOpacity>

          <ShareButton onPress={handleSharePool} />

          <StatusPill />

          <IdentityFooter
            emoji={profile.avatar_animal}
            identityName={profile.avatar_name}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: "center",
  },
  joinCodeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
    backgroundColor: colors.background.card,
    borderRadius: 16,
  },
  joinCodeLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  joinCodeLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
  joinCodeBox: {
    backgroundColor: colors.primary.yellowLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.yellow,
    borderStyle: 'dashed',
  },
  joinCodeText: {
    fontSize: 32,
    fontWeight: typography.weights.bold as any,
    color: colors.text.dark,
    letterSpacing: 4,
  },
  joinCodeHint: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: 8,
  },
  addOptionButton: {
    width: "100%",
    borderWidth: 2,
    borderColor: colors.primary.yellow,
    borderRadius: 16,
    borderStyle: "dashed",
    backgroundColor: colors.background.card,
    padding: 20,
    marginBottom: 20,
  },
  addOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addOptionTextContainer: {
    flex: 1,
  },
  addOptionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 4,
  },
  addOptionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
});

