import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ExpoClipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconPickerModal } from "../components/ui/IconPickerModal";
import { IdentityBanner } from "../components/ui/IdentityBanner";
import { NewSuggestionHeader } from "../components/ui/NewSuggestionHeader";
import { NoteTextarea } from "../components/ui/NoteTextarea";
import { PreviousSuggestions, type PreviousSuggestion } from "../components/ui/PreviousSuggestions";
import { SubmitSuggestionButton } from "../components/ui/SubmitSuggestionButton";
import { SuggestionInput } from "../components/ui/SuggestionInput";
import { getAvatarEmoji } from "../constants/avatars";
import { colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { addFoodOption, getFoodOptions, getPoolResults, getProfile, removeFoodOption, type FoodOption, type Pool, type Profile } from "../services/api";

export default function NewSuggestion() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pool, setPool] = useState<Pool | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [note, setNote] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("silverware-fork-knife");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [existingSuggestions, setExistingSuggestions] = useState<FoodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load user profile and existing suggestions
  useEffect(() => {
    async function loadData() {
      if (!user) {
        router.replace("/");
        return;
      }

      if (!poolId) {
        Alert.alert(t('common.error'), t('newSuggestion.errors.noPoolId'));
        router.back();
        return;
      }

      try {
        const [profileData, foodOptions, poolData] = await Promise.all([
          getProfile(user.id),
          getFoodOptions(poolId),
          getPoolResults(poolId),
        ]);
        
        setProfile(profileData);
        setExistingSuggestions(foodOptions);
        setPool(poolData.pool);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert(t('common.error'), t('newSuggestion.errors.loadFailed'));
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
      await ExpoClipboard.setStringAsync(pool.join_code);
      Alert.alert(t('common.success'), t('results.copied'));
    }
  };

  const handleSelectSuggestion = (suggestion: PreviousSuggestion) => {
    setSuggestion(suggestion.text);
    if (suggestion.icon) {
      // Fix for legacy 'pizza-slice' icon which isn't in MaterialCommunityIcons
      const iconName = suggestion.icon === 'pizza-slice' ? 'pizza' : suggestion.icon;
      setSelectedIcon(iconName);
    }
  };

  const handleDeleteSuggestion = async (suggestionId: string) => {
// ... existing code ...

// ... inside render ...
            <TouchableOpacity
              style={styles.iconPickerButton}
              onPress={() => setShowIconPicker(true)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name={(selectedIcon === 'pizza-slice' ? 'pizza' : selectedIcon) as any}
                  size={26}
                  color={colors.primary.yellow}
                />
              </View>
            </TouchableOpacity>
    Alert.alert(
      t('common.delete'),
      t('newSuggestion.deleteConfirmation', { defaultValue: 'Are you sure you want to delete this option?' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await removeFoodOption(suggestionId);
              // Reload suggestions
              if (poolId) {
                const updatedOptions = await getFoodOptions(poolId);
                setExistingSuggestions(updatedOptions);
              }
            } catch (error: any) {
              console.error("Error deleting suggestion:", error);
              Alert.alert(t('common.error'), error.message || "Failed to delete suggestion");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!suggestion.trim()) {
      Alert.alert(t('common.error'), t('newSuggestion.errors.missingSuggestion'));
      return;
    }

    if (!poolId) {
      Alert.alert(t('common.error'), t('newSuggestion.errors.noPoolId'));
      return;
    }

    const normalizedSuggestion = suggestion.trim().toLowerCase();
    const isDuplicate = existingSuggestions.some(
      (option) => option.name.toLowerCase() === normalizedSuggestion
    );

    if (isDuplicate) {
      Alert.alert(t('common.error'), t('newSuggestion.errors.duplicate', { defaultValue: 'This option already exists!' }));
      return;
    }

    setSubmitting(true);
    try {
      await addFoodOption(poolId, suggestion.trim(), note.trim(), selectedIcon);
      
      Alert.alert(
        t('newSuggestion.success.title'),
        t('newSuggestion.success.message'),
        [
          {
            text: t('newSuggestion.buttons.addAnother'),
            onPress: () => {
              setSuggestion("");
              setNote("");
              setSelectedIcon("silverware-fork-knife");
              // Reload suggestions
              getFoodOptions(poolId).then(setExistingSuggestions);
            },
          },
          {
            text: t('newSuggestion.buttons.goToVote'),
            onPress: () => router.replace(`/vote?poolId=${poolId}`),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error adding suggestion:", error);
      Alert.alert(t('common.error'), error.message || "Failed to add suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = suggestion.trim().length > 0;

  // Convert existing food options to previous suggestions format
  const previousSuggestions: PreviousSuggestion[] = existingSuggestions.map((option) => ({
    id: option.id,
    text: option.name,
    icon: option.icon || "silverware-fork-knife", // Use saved icon or default
    creatorId: option.creator_id,
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <NewSuggestionHeader onBack={() => router.push('/dashboard')} />

          <IdentityBanner
            identityEmoji={getAvatarEmoji(profile.avatar_animal)}
            message={t('newSuggestion.identityMessage')}
          />

          <View style={styles.inputRow}>
            {/* Icon Picker */}
            <TouchableOpacity
              style={styles.iconPickerButton}
              onPress={() => setShowIconPicker(true)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name={selectedIcon as any}
                  size={26}
                  color={colors.primary.yellow}
                />
              </View>
            </TouchableOpacity>

            {/* Input Field */}
            <View style={styles.inputWrapper}>
              <SuggestionInput
                value={suggestion}
                onChangeText={setSuggestion}
                label={t('newSuggestion.inputLabel')}
              />
            </View>
          </View>

          {previousSuggestions.length > 0 && (
            <PreviousSuggestions
              suggestions={previousSuggestions}
              onSelect={handleSelectSuggestion}
              onDelete={handleDeleteSuggestion}
              currentUserId={user?.id}
            />
          )}

          <NoteTextarea
            value={note}
            onChangeText={setNote}
          />

          <SubmitSuggestionButton
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
          />

          <TouchableOpacity 
            onPress={() => {
              if (poolId) router.push(`/vote?poolId=${poolId}`);
            }}
            activeOpacity={0.8}
            style={styles.liveResultsButton}
          >
            <Text style={styles.liveResultsText}>{t('sharePool.viewLiveResults', { defaultValue: 'Go to Live Results' })}</Text>
            <FontAwesome5 name="vote-yea" size={16} color={colors.primary.yellow} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Icon Picker Modal */}
          <IconPickerModal
            visible={showIconPicker}
            selectedIcon={selectedIcon}
            onSelect={setSelectedIcon}
            onClose={() => setShowIconPicker(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top for precise spacing
    marginBottom: 20,
    gap: 12,
  },
  inputWrapper: {
    flex: 1, // Take remaining space
  },
  iconSection: {
    // Removed
  },
  iconPickerButton: {
    // Removed card styling (bg, border, padding)
  },
  iconCircle: {
    width: 50, // Match input height (approx 50px)
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary.yellow,
    marginTop: 31, // Align with input field (approx label height + margin)
  },
  joinCodeContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  joinCodeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  joinCodeLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    fontWeight: "500",
  },
  joinCodeValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary.yellow,
    letterSpacing: 4,
    marginVertical: 4,
  },
  joinCodeHint: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  liveResultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  liveResultsText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary.yellow,
  },
});
