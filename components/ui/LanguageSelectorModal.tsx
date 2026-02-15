import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { borderRadius, colors, typography } from "../../constants/theme";

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

import { scheduleDailyNotification } from "../../services/NotificationService";

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("user-language", lang);
    // Reschedule notifications with new language
    await scheduleDailyNotification();
    onClose();
  };

  const currentLanguage = i18n.language;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("profile.selectLanguage")}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={colors.text.grey} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                currentLanguage === 'en' && styles.selectedOption
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.optionText,
                currentLanguage === 'en' && styles.selectedOptionText
              ]}>
                🇺🇸 {t("profile.english")}
              </Text>
              {currentLanguage === 'en' && (
                <FontAwesome5 name="check" size={16} color={colors.primary.yellowDark} />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[
                styles.option,
                currentLanguage === 'tr' && styles.selectedOption
              ]}
              onPress={() => changeLanguage('tr')}
            >
              <Text style={[
                styles.optionText,
                currentLanguage === 'tr' && styles.selectedOptionText
              ]}>
                🇹🇷 {t("profile.turkish")}
              </Text>
              {currentLanguage === 'tr' && (
                <FontAwesome5 name="check" size={16} color={colors.primary.yellowDark} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
    borderRadius: borderRadius.lg,
    width: "100%",
    maxWidth: 320,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
  },
  selectedOption: {
    backgroundColor: colors.primary.yellowLight,
  },
  optionText: {
    fontSize: typography.sizes.md,
    color: colors.text.dark,
    fontWeight: typography.weights.medium,
  },
  selectedOptionText: {
    fontWeight: typography.weights.bold,
    color: colors.primary.yellowDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 4,
  },
});
