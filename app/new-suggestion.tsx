import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { IdentityBanner } from "../components/ui/IdentityBanner";
import { NewSuggestionHeader } from "../components/ui/NewSuggestionHeader";
import { NoteTextarea } from "../components/ui/NoteTextarea";
import { PreviousSuggestions, type PreviousSuggestion } from "../components/ui/PreviousSuggestions";
import { SubmitSuggestionButton } from "../components/ui/SubmitSuggestionButton";
import { SuggestionInput } from "../components/ui/SuggestionInput";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { addFoodOption, getFoodOptions, getProfile, type FoodOption, type Profile } from "../services/api";

export default function NewSuggestion() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams<{ poolId: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [note, setNote] = useState("");
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
        Alert.alert("Error", "No pool ID provided");
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
        Alert.alert("Error", "Failed to load data");
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
      Alert.alert("Error", "Please enter a suggestion");
      return;
    }

    if (!poolId) {
      Alert.alert("Error", "No pool ID");
      return;
    }

    setSubmitting(true);
    try {
      await addFoodOption(poolId, suggestion.trim(), note.trim());
      
      Alert.alert(
        "Success!",
        "Your suggestion has been added. Add another or go to voting.",
        [
          {
            text: "Add Another",
            onPress: () => {
              setSuggestion("");
              setNote("");
              // Reload suggestions
              getFoodOptions(poolId).then(setExistingSuggestions);
            },
          },
          {
            text: "Go to Vote",
            onPress: () => router.push(`/vote?poolId=${poolId}`),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error adding suggestion:", error);
      Alert.alert("Error", error.message || "Failed to add suggestion");
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
        <NewSuggestionHeader onBack={handleBack} />

        <IdentityBanner
          identityName={profile.avatar_name.replace("Anonymous ", "")}
          identityEmoji={profile.avatar_animal}
          message={`${profile.avatar_animal} What's for lunch today?`}
        />

        <SuggestionInput
          value={suggestion}
          onChangeText={setSuggestion}
          label="What are you craving?"
        />

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
});
