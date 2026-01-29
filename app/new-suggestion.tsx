import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NewSuggestionHeader } from "../components/ui/NewSuggestionHeader";
import { IdentityBanner } from "../components/ui/IdentityBanner";
import { SuggestionInput } from "../components/ui/SuggestionInput";
import { PreviousSuggestions, type PreviousSuggestion } from "../components/ui/PreviousSuggestions";
import { LocationSearch } from "../components/ui/LocationSearch";
import { LocationCard } from "../components/ui/LocationCard";
import { NoteTextarea } from "../components/ui/NoteTextarea";
import { SubmitSuggestionButton } from "../components/ui/SubmitSuggestionButton";
import { colors } from "../constants/theme";

export default function NewSuggestion() {
  const router = useRouter();
  const [suggestion, setSuggestion] = useState("");
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
  } | null>({
    name: "Burger Town Central",
    address: "123 Office Plaza, 2nd Floor",
  });
  const [note, setNote] = useState("");

  // Sample previous suggestions
  const previousSuggestions: PreviousSuggestion[] = [
    { id: "1", text: "Double Cheeseburger", emoji: "🍔" },
    { id: "2", text: "Street Tacos Trio", emoji: "🌮" },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSelectSuggestion = (suggestion: PreviousSuggestion) => {
    setSuggestion(suggestion.text);
  };

  const handleLocationChange = () => {
    // TODO: Implement location picker/modal
    console.log("Change location");
  };

  const handleSubmit = () => {
    // TODO: Implement suggestion submission
    console.log("Submitting suggestion:", {
      suggestion,
      location: selectedLocation,
      note,
    });
    // Navigate back to dashboard or show success
    router.back();
  };

  const isFormValid = suggestion.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NewSuggestionHeader onBack={handleBack} />

        <IdentityBanner
          identityName="Lion"
          identityEmoji="🦁"
          message="Roar! What's for lunch today?"
        />

        <SuggestionInput
          value={suggestion}
          onChangeText={setSuggestion}
          label="What are you craving?"
        />

        <PreviousSuggestions
          suggestions={previousSuggestions}
          onSelect={handleSelectSuggestion}
        />

        <LocationSearch
          value={location}
          onChangeText={setLocation}
        />

        {selectedLocation && (
          <LocationCard
            name={selectedLocation.name}
            address={selectedLocation.address}
            onChange={handleLocationChange}
          />
        )}

        <NoteTextarea
          value={note}
          onChangeText={setNote}
        />

        <SubmitSuggestionButton
          onPress={handleSubmit}
          disabled={!isFormValid}
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
});

