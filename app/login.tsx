import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert, KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageSelectorModal } from "../components/ui/LanguageSelectorModal";
import { borderRadius, colors, spacing, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.errors.fillAll'));
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(t('auth.errors.loginFailed'), error.message);
    } else {
      router.replace("/dashboard");
    }
  };



  const handleForgotPassword = () => {
    Alert.alert(
      t('auth.forgotPassword'),
      "Password reset functionality will be implemented soon."
    );
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
          {/* Header with Back Button and Logo */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.dark} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="utensils" size={24} color={colors.primary.yellow} />
            </View>
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <FontAwesome5 name="globe" size={20} color={colors.text.dark} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
            <Text style={styles.subtitle}>{t('auth.avatarWaiting')}</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('auth.email')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color="#aaa"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="hello@example.com"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{t('auth.password')}</Text>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotLink}>{t('auth.forgotPassword')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color="#aaa"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
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
                      size={16}
                      color="#ccc"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? t('auth.loggingIn') : t('auth.login')}
                </Text>
              </TouchableOpacity>
            </View>


            {/* Watermark (optional decorative element) */}
            <View style={styles.watermark}>
              <Ionicons name="paw-outline" size={120} color="#000" style={{ opacity: 0.05 }} />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('auth.newToLunchVote')}{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/signup")}
                >
                  {t('auth.createAccount')}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LanguageSelectorModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  languageButton: {
    position: "absolute",
    right: spacing.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg + 4,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.grey,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 10,
  },
  forgotLink: {
    fontSize: 12,
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    paddingVertical: 16,
    paddingLeft: 45,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.full,
    fontSize: 15,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  fieldIcon: {
    position: "absolute",
    left: 18,
    top: "50%",
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
  loginButton: {
    width: "100%",
    backgroundColor: colors.primary.yellow,
    paddingVertical: 18,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
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
    fontSize: 13,
    color: "#ccc",
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
  watermark: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: [{ translateX: -60 }],
    zIndex: -1,
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.grey,
  },
  footerLink: {
    color: colors.primary.yellow,
    fontWeight: typography.weights.bold,
  },
});
