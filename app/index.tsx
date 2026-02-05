import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { LoginContent } from "../components/ui/LoginContent";
import { colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

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
  scrollContent: {
    flexGrow: 1,
  },
});
