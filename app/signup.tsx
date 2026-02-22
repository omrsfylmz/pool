import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageSelectorModal } from "../components/ui/LanguageSelectorModal";
import { borderRadius, colors, spacing, typography } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUp, verifyOtp, resendOtp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // OTP Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["" , "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.errors.fillAll'));
      return;
    }

    if (password.length < 8) {
      Alert.alert(t('common.error'), t('auth.errors.passwordLength'));
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      Alert.alert(t('auth.errors.signupFailed'), error.message);
    }
    // OTP doğrulama akışını aktifleştirmek için aşağıdaki satırı açın
    // ve Supabase Dashboard'da "Confirm email" seçeneğini aktifleştirin:
    // else { setIsVerifying(true); }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (text: string, index: number) => {
    // Handle paste (if user pastes a 6-digit code)
    if (text.length > 1) {
      const pastedDigits = text.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newDigits = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        if (index + i < 6) newDigits[index + i] = d;
      });
      setOtpDigits(newDigits);
      setOtpError(false);
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = text.replace(/[^0-9]/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError(false);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
      const newDigits = [...otpDigits];
      newDigits[index - 1] = "";
      setOtpDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpDigits.join("");
    if (code.length !== 6) {
      Alert.alert(t('common.error'), t('auth.verification.enterCode'));
      return;
    }

    setLoading(true);
    const { error } = await verifyOtp(email, code);
    setLoading(false);

    if (error) {
      setOtpError(true);
      triggerShake();
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    // If successful, verifyOtp triggers onAuthStateChange → auto-login
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const { error } = await resendOtp(email);
    setLoading(false);

    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      Alert.alert(t('common.success'), t('auth.verification.resendSuccess'));
    }
  };

  const resetVerification = () => {
    setIsVerifying(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError(false);
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
              onPress={() => isVerifying ? resetVerification() : router.back()}
            >
              <Ionicons name="chevron-back" size={28} color={colors.text.dark} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <FontAwesome5 name="globe" size={20} color={colors.text.dark} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {!isVerifying ? (
              <>
                <Text style={styles.title}>{t('auth.joinThePack')}</Text>
                <Text style={styles.subtitle}>{t('auth.createProfile')}</Text>

                {/* Form */}
                <View style={styles.form}>
                  {/* Full Name Input */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('auth.fullName')}</Text>
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
                    <Text style={styles.label}>{t('auth.workEmail')}</Text>
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
                    <Text style={styles.label}>{t('auth.password')}</Text>
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
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleCreateAccount}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {t('auth.alreadyHaveAccount')}{" "}
                    <Text
                      style={styles.footerLink}
                      onPress={() => router.push("/login")}
                    >
                      {t('auth.login')}
                    </Text>
                  </Text>
                </View>
              </>
            ) : (
              /* OTP Verification View */
              <View style={styles.verifyContainer}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="mail-open-outline" size={48} color={colors.primary.yellowDark} />
                  </View>
                </View>
                <Text style={[styles.title, { textAlign: 'center' }]}>{t('auth.verification.title')}</Text>
                <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 30 }]}>
                  {t('auth.verification.subtitle')}{"\n"}
                  <Text style={{ fontWeight: 'bold', color: colors.text.dark }}>{email}</Text>
                </Text>

                {/* 6 Digit OTP Input Boxes */}
                <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
                  {otpDigits.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : null,
                        otpError ? styles.otpBoxError : null,
                      ]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      autoFocus={index === 0}
                      selectTextOnFocus
                      selectionColor={colors.primary.yellow}
                    />
                  ))}
                </Animated.View>

                {otpError && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color={colors.status.error} />
                    <Text style={styles.errorText}>{t('auth.verification.invalidCode')}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleVerifyOtp}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? t('auth.verification.verifying') : t('auth.verification.verifyButton')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={handleResendOtp}
                >
                  <Text style={styles.resendText}>
                    {t('auth.verification.didntReceive')}{" "}
                    <Text style={styles.resendLink}>{t('auth.verification.resend')}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: "#1a1a1a",
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
  // OTP Styles
  verifyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    color: colors.text.dark,
    backgroundColor: colors.background.card,
  },
  otpBoxFilled: {
    borderColor: colors.primary.yellow,
    backgroundColor: colors.primary.yellowLight,
  },
  otpBoxError: {
    borderColor: colors.status.error,
    backgroundColor: '#fff5f5',
  },
  errorContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: colors.status.error,
    fontWeight: '500' as const,
  },
  resendButton: {
    marginTop: 24,
    alignItems: 'center' as const,
  },
  resendText: {
    fontSize: 14,
    color: colors.text.grey,
  },
  resendLink: {
    fontWeight: 'bold' as const,
    color: colors.primary.yellowDark,
  },
});

