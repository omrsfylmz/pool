import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

interface PasswordUpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('passwordUpdate.error.fillAll'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('passwordUpdate.error.mismatch'));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t('common.error'), t('passwordUpdate.error.length'));
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(t('common.error'), t('passwordUpdate.error.sameAsOld'));
      return;
    }

    setLoading(true);

    try {
      // Update password - Supabase requires user to be authenticated
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Stop loading BEFORE showing success to prevent stuck spinner perception
      setLoading(false);

      Alert.alert(
        t('common.success'), 
        t('passwordUpdate.success'),
        [
          { 
            text: "OK", 
            onPress: () => {
              // Clear fields and close modal only after user acknowledges
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              onClose();
            }
          }
        ]
      );
      
    } catch (error: any) {
      console.error("Error updating password:", error);
      setLoading(false);
      
      // Handle specific "Same Password" error from Supabase
      // Supabase returns: "New password should be different from the old password."
      if (error.message?.toLowerCase().includes("same") || 
          error.message?.toLowerCase().includes("different") ||
          error.message?.toLowerCase().includes("new password should be")) {
        Alert.alert(t('common.error'), t('passwordUpdate.error.sameAsOld'));
      } else if (error.message?.toLowerCase().includes("timeout")) {
        Alert.alert(t('common.error'), 'Request timeout. Please check your internet connection and try again.');
      } else {
        Alert.alert(t('common.error'), error.message || t('passwordUpdate.error.failed'));
      }
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('passwordUpdate.title')}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="times" size={20} color={colors.text.grey} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('passwordUpdate.currentPassword')}</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <FontAwesome5 name="lock" size={14} color={colors.text.grey} />
                </View>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder={t('passwordUpdate.enterCurrent')}
                  placeholderTextColor={colors.text.grey}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <FontAwesome5
                    name={showCurrentPassword ? "eye" : "eye-slash"}
                    size={16}
                    color={colors.text.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('passwordUpdate.newPassword')}</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <FontAwesome5 name="key" size={14} color={colors.text.grey} />
                </View>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder={t('passwordUpdate.enterNew')}
                  placeholderTextColor={colors.text.grey}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <FontAwesome5
                    name={showNewPassword ? "eye" : "eye-slash"}
                    size={16}
                    color={colors.text.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('passwordUpdate.confirmNewPassword')}</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <FontAwesome5 name="check-circle" size={14} color={colors.text.grey} />
                </View>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('passwordUpdate.confirmNew')}
                  placeholderTextColor={colors.text.grey}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome5
                    name={showConfirmPassword ? "eye" : "eye-slash"}
                    size={16}
                    color={colors.text.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>{t('passwordUpdate.requirements')}</Text>
              <Text style={styles.requirementText}>• {t('passwordUpdate.requirementText')}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.updateButton, loading && styles.updateButtonDisabled]}
              onPress={handleUpdatePassword}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.updateButtonText} numberOfLines={1} adjustsFontSizeToFit>
                  {t('passwordUpdate.updateButton')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingBottom: 16,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 16,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: typography.sizes.sm,
    color: colors.text.dark,
  },
  eyeButton: {
    padding: 14,
  },
  requirementsBox: {
    backgroundColor: colors.primary.yellowLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  requirementsTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 0,
  },
  requirementText: {
    fontSize: typography.sizes.xs,
    color: colors.text.grey,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.main,
  },
  cancelButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
  },
  updateButton: {
    flex: 1,
    padding: 16,
    borderRadius: 50,
    backgroundColor: colors.primary.yellow,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  updateButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
