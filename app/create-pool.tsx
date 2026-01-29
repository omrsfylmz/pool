import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CreatePoolHeader } from "../components/ui/CreatePoolHeader";
import { IdentitySection } from "../components/ui/IdentitySection";
import { PoolDetailsForm } from "../components/ui/PoolDetailsForm";
import { CreatePoolButton } from "../components/ui/CreatePoolButton";
import { colors } from "../constants/theme";

export default function CreatePool() {
  const router = useRouter();
  const [poolTitle, setPoolTitle] = useState("");
  const [poolDescription, setPoolDescription] = useState("");
  const [votingDuration, setVotingDuration] = useState(5);

  const handleClose = () => {
    router.back();
  };

  const handleHelp = () => {
    // TODO: Implement help modal or navigation
    console.log("Help pressed");
  };

  const handleStartVoting = () => {
    // TODO: Implement pool creation logic
    console.log("Starting voting with:", {
      title: poolTitle,
      description: poolDescription,
      duration: votingDuration,
    });
    // Navigate to new suggestion page
    router.push("/new-suggestion");
  };

  const isFormValid = poolTitle.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CreatePoolHeader onClose={handleClose} onHelp={handleHelp} />

        <IdentitySection identityName="Anonymous Lion" />

        <PoolDetailsForm
          onTitleChange={setPoolTitle}
          onDescriptionChange={setPoolDescription}
          onDurationChange={setVotingDuration}
          initialDuration={votingDuration}
        />

        <CreatePoolButton
          onPress={handleStartVoting}
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
    paddingBottom: 30,
  },
});

