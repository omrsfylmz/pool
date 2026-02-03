import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { JoinRoomHeader } from "../components/ui/JoinRoomHeader";
import { colors, typography } from "../constants/theme";
import { getPoolByJoinCode, joinPoolMember } from "../services/api";

export default function JoinRoom() {
  const router = useRouter();
  const { t } = useTranslation();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();

    if (code.length !== 6) {
      Alert.alert(t('join.errors.invalid'), t('join.errors.invalidLength'));
      return;
    }

    setLoading(true);

    try {
      const pool = await getPoolByJoinCode(code);

      if (!pool) {
        Alert.alert(
          t('join.errors.notFound'),
          t('join.errors.notFoundMessage')
        );
        return;
      }

      // Join the pool as a member
      await joinPoolMember(pool.id);

      // Navigate to vote page with pool ID
      router.push(`/vote?poolId=${pool.id}`);
    } catch (error) {
      console.error("Error joining pool:", error);
      Alert.alert(t('common.error'), t('join.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <JoinRoomHeader onClose={handleClose} />

        <View style={styles.main}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome5
              name="ticket-alt"
              size={64}
              color={colors.primary.yellow}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('join.title')}</Text>
          <Text style={styles.subtitle}>
            {t('join.subtitle')}
          </Text>

          {/* Join Code Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('join.label')}</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC123"
              value={joinCode}
              onChangeText={(text) => setJoinCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              editable={!loading}
            />
          </View>

          {/* Join Button */}
          <TouchableOpacity
            style={[
              styles.joinButton,
              (joinCode.length !== 6 || loading) && styles.joinButtonDisabled,
            ]}
            onPress={handleJoin}
            disabled={joinCode.length !== 6 || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.dark} />
            ) : (
              <>
                <FontAwesome5
                  name="sign-in-alt"
                  size={18}
                  color={colors.text.dark}
                />
                <Text style={styles.joinButtonText}>{t('join.button')}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <FontAwesome5
              name="info-circle"
              size={16}
              color={colors.text.grey}
            />
            <Text style={styles.helpText}>
              {t('join.help')}
            </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: typography.weights.bold as any,
    color: colors.text.dark,
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  joinButton: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.card,
    borderRadius: 8,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
  },
});
