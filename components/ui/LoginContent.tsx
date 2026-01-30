import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../constants/theme";
import { IconCard } from "./IconCard";
import { PrimaryButton } from "./PrimaryButton";

interface LoginContentProps {
  onCreateAccount?: () => void;
  onLogIn?: () => void;
}

/**
 * LoginContent Component
 * Main content area for the login page
 */
export const LoginContent: React.FC<LoginContentProps> = ({
  onCreateAccount,
  onLogIn,
}) => {
  return (
    <View style={styles.container}>
      <IconCard />

      <Text style={styles.title}>What&apos;s for Lunch?</Text>
      <Text style={styles.subtitle}>
        Vote with your team, stay{"\n"}anonymous.
      </Text>

      <PrimaryButton text="Log In" onPress={onLogIn} />
      <PrimaryButton text="Create Account" onPress={onCreateAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 450,
    width: "100%",
    padding: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: -1,
    color: colors.text.dark,
  },
  subtitle: {
    color: colors.text.grey,
    fontSize: typography.sizes.md,
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 24,
  },
});

