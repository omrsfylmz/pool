import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconCard } from "./IconCard";
import { GoogleButton } from "./GoogleButton";
import { PrimaryButton } from "./PrimaryButton";
import { FooterLink } from "./FooterLink";
import { colors, typography } from "../../constants/theme";

interface LoginContentProps {
  onGoogleSignUp?: () => void;
  onCreateAccount?: () => void;
  onLogIn?: () => void;
}

/**
 * LoginContent Component
 * Main content area for the login page
 */
export const LoginContent: React.FC<LoginContentProps> = ({
  onGoogleSignUp,
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

      <GoogleButton onPress={onGoogleSignUp} />
      <PrimaryButton text="Create Account" onPress={onCreateAccount} />

      <FooterLink linkText="Log In" onPress={onLogIn} />
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

