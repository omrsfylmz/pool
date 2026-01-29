import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { SharePoolHeader } from "../components/ui/SharePoolHeader";
import { HeroCard } from "../components/ui/HeroCard";
import { FirstPickCard } from "../components/ui/FirstPickCard";
import { ShareButton } from "../components/ui/ShareButton";
import { QRCodeArea } from "../components/ui/QRCodeArea";
import { StatusPill } from "../components/ui/StatusPill";
import { IdentityFooter } from "../components/ui/IdentityFooter";
import { colors } from "../constants/theme";

export default function SharePool() {
  const router = useRouter();

  // Sample data - replace with actual pool data
  const poolData = {
    name: "Friday Team Lunch",
    firstPick: {
      title: "Artisan Tacos",
      location: "Mexican Cuisine",
      distance: "0.4 mi",
    },
    identity: {
      emoji: "🦊",
      name: "The Clever Fox",
    },
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Navigate to vote page
    router.push("/vote");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SharePoolHeader onBack={handleBack} />

        <View style={styles.main}>
          <HeroCard
            poolName={poolData.name}
            successTag="Success! Your Pool is Live"
          />

          <FirstPickCard
            title={poolData.firstPick.title}
            location={poolData.firstPick.location}
            distance={poolData.firstPick.distance}
          />

          <ShareButton onPress={handleShare} />

          <QRCodeArea />

          <StatusPill />

          <IdentityFooter
            emoji={poolData.identity.emoji}
            identityName={poolData.identity.name}
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
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: "center",
  },
});

