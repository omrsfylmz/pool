import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { JoinRoomHeader } from "../components/ui/JoinRoomHeader";
import { AvatarContainer } from "../components/ui/AvatarContainer";
import { IdentityDisplay } from "../components/ui/IdentityDisplay";
import { JoinButton } from "../components/ui/JoinButton";
import { colors } from "../constants/theme";

export default function JoinRoom() {
  // Sample identity data - replace with actual data
  const identityData = {
    name: "Red Fox",
    avatarUri: undefined, // Can be set to actual image URI
  };

  const handleClose = () => {
    // TODO: Implement close action
    console.log("Close pressed");
  };

  const handleJoin = () => {
    // TODO: Implement join action
    console.log("Join room pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <JoinRoomHeader onClose={handleClose} />

        <View style={styles.main}>
          <AvatarContainer imageUri={identityData.avatarUri} />

          <IdentityDisplay identityName={identityData.name} />

          <View style={styles.buttonContainer}>
            <JoinButton onPress={handleJoin} />
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
  buttonContainer: {
    width: "100%",
    marginTop: "auto",
  },
});

