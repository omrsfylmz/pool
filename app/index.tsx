import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Header } from "../components/ui/Header";
import { LoginContent } from "../components/ui/LoginContent";
import { colors } from "../constants/theme";

export default function Index() {
  const router = useRouter();

  const handleGoogleSignUp = () => {
    // Navigate to dashboard (Google auth will be implemented later)
    router.push("/dashboard");
  };

  const handleCreateAccount = () => {
    // Navigate to sign up page
    router.push("/signup");
  };

  const handleLogIn = () => {
    // Navigate to login page
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <LoginContent
          onGoogleSignUp={handleGoogleSignUp}
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
  scrollContent: {
    flexGrow: 1,
  },
});
