import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FOOD_ICONS, IconPickerModal } from "../components/ui/IconPickerModal";
import { IdentityBanner } from "../components/ui/IdentityBanner";
import { NewSuggestionHeader } from "../components/ui/NewSuggestionHeader";
import { NoteTextarea } from "../components/ui/NoteTextarea";
import { PreviousSuggestions, type PreviousSuggestion } from "../components/ui/PreviousSuggestions";
import { SubmitSuggestionButton } from "../components/ui/SubmitSuggestionButton";
import { SuggestionInput } from "../components/ui/SuggestionInput";
import { borderRadius, colors, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { addFoodOption, getFoodOptions, getProfile, type FoodOption, type Profile } from "../services/api";

export default function NewSuggestion() {
  const router = useRouter();
  const { t } = useTranslation();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [note, setNote] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("utensils");
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
        const [profileData, foodOptions] = await Promise.all([
          getProfile(user.id),
          getFoodOptions(poolId),
        ]);
        
        setProfile(profileData);
        setExistingSuggestions(foodOptions);
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

  const handleSelectSuggestion = (suggestion: PreviousSuggestion) => {
    setSuggestion(suggestion.text);
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
              setSelectedIcon("utensils");
              // Reload suggestions
              getFoodOptions(poolId).then(setExistingSuggestions);
            },
          },
          {
            text: t('newSuggestion.buttons.goToVote'),
            onPress: () => router.push(`/vote?poolId=${poolId}`),
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
    emoji: "🍽️", // Default emoji, you can enhance this later
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NewSuggestionHeader onBack={() => router.push('/dashboard')} />

        <IdentityBanner
          identityName={profile.avatar_name.replace("Anonymous ", "")}
          identityEmoji={profile.avatar_animal}
          message={`${profile.avatar_animal} ${t('newSuggestion.identityMessage')}`}
        />

        <SuggestionInput
          value={suggestion}
          onChangeText={setSuggestion}
          label={t('newSuggestion.inputLabel')}
        />

        {/* Icon Picker */}
        <View style={styles.iconSection}>
          <Text style={styles.iconLabel}>{t('newSuggestion.iconLabel')}</Text>
          <TouchableOpacity
            style={styles.iconPickerButton}
            onPress={() => setShowIconPicker(true)}
            activeOpacity={0.8}
          >
            <View style={styles.iconPreview}>
              <View style={styles.iconCircle}>
                <FontAwesome5
                  name={selectedIcon}
                  size={24}
                  color={colors.primary.yellow}
                />
              </View>
              <Text style={styles.iconName}>
                {FOOD_ICONS.find(i => i.name === selectedIcon)?.label || 'Utensils'}
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color={colors.text.grey} />
          </TouchableOpacity>
        </View>

        {previousSuggestions.length > 0 && (
          <PreviousSuggestions
            suggestions={previousSuggestions}
            onSelect={handleSelectSuggestion}
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

        {/* Icon Picker Modal */}
        <IconPickerModal
          visible={showIconPicker}
          selectedIcon={selectedIcon}
          onSelect={setSelectedIcon}
          onClose={() => setShowIconPicker(false)}
        />
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  iconSection: {
    marginBottom: 20,
  },
  iconLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  iconPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  iconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.dark,
  },
});
