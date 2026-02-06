import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../../constants/theme";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('privacyPolicy.title')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="times" size={20} color={colors.text.grey} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lastUpdated}>{t('privacyPolicy.lastUpdated')}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('privacyPolicy.sections.intro.title')}</Text>
            <Text style={styles.paragraph}>
              {t('privacyPolicy.sections.intro.text')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('privacyPolicy.sections.dataCollection.title')}</Text>
            <Text style={styles.paragraph}>
              {t('privacyPolicy.sections.dataCollection.text')}
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.dataCollection.bullets.identity')}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.dataCollection.bullets.contact')}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.dataCollection.bullets.usage')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('privacyPolicy.sections.usage.title')}</Text>
            <Text style={styles.paragraph}>
              {t('privacyPolicy.sections.usage.text')}
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.usage.bullets.register')}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.usage.bullets.manage')}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{t('privacyPolicy.sections.usage.bullets.participate')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('privacyPolicy.sections.security.title')}</Text>
            <Text style={styles.paragraph}>
              {t('privacyPolicy.sections.security.text')}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('privacyPolicy.footer')}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: typography.sizes.md,
    color: colors.text.dark,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: typography.sizes.md,
    color: colors.text.dark,
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text.dark,
    lineHeight: 24,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    textAlign: "center",
    lineHeight: 20,
  },
});
