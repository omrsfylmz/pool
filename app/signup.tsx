import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { borderRadius, colors, spacing, typography } from "../constants/theme";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = () => {
    // TODO: Implement account creation logic
    console.log("Creating account:", { fullName, email, password });
    router.push("/dashboard");
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google sign up
    console.log("Google sign up");
    router.push("/dashboard");
  };

  const handleAppleSignUp = () => {
    // TODO: Implement Apple sign up
    console.log("Apple sign up");
    router.push("/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color={colors.text.dark} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Join the Pack!</Text>
            <Text style={styles.subtitle}>Create your anonymous profile.</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Full Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#aaa"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Work Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john@company.com"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#ccc"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignUp}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleSignUp}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/login")}
                >
                  Log In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg + 4,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.grey,
    marginBottom: 40,
  },
  form: {
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 16,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: 18,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 16,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  eyeIcon: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  submitButton: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    paddingVertical: 18,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: "#1a1a1a",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#aaa",
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.full,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.grey,
  },
  footerLink: {
    color: colors.primary.yellowDark,
    fontWeight: typography.weights.bold,
  },
});
