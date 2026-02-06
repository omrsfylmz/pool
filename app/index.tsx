import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContent } from "../components/ui/LoginContent";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading]);

  const handleCreateAccount = () => {
    // Navigate to sign up page
    router.push("/signup");
  };

  const handleLogIn = () => {
    // Navigate to login page
    router.push("/login");
  };

  // Show loading while checking auth state
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
      {/* Background Icons */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <FontAwesome5 name="pizza-slice" size={120} color={colors.primary.yellow} style={[styles.bgIcon, { top: "10%", left: -30, transform: [{ rotate: "15deg" }], opacity: 0.1 }]} />
        <FontAwesome5 name="hamburger" size={100} color={colors.primary.yellow} style={[styles.bgIcon, { top: "25%", right: -20, transform: [{ rotate: "-20deg" }], opacity: 0.08 }]} />
        <FontAwesome5 name="hotdog" size={90} color={colors.primary.yellow} style={[styles.bgIcon, { bottom: "30%", left: 20, transform: [{ rotate: "45deg" }], opacity: 0.08 }]} />
        <FontAwesome5 name="ice-cream" size={110} color={colors.primary.yellow} style={[styles.bgIcon, { bottom: "10%", right: -10, transform: [{ rotate: "-15deg" }], opacity: 0.1 }]} />
        <FontAwesome5 name="carrot" size={60} color={colors.primary.yellow} style={[styles.bgIcon, { top: "45%", left: "40%", transform: [{ rotate: "90deg" }], opacity: 0.05 }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LoginContent
          onCreateAccount={handleCreateAccount}
          onLogIn={handleLogIn}
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  bgIcon: {
    position: "absolute",
  },
  scrollContent: {
    flexGrow: 1,
    zIndex: 1,
    justifyContent: "center",
  },
});
