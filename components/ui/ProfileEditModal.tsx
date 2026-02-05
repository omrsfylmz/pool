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
import { borderRadius, colors, typography } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../services/api"; // Ensure this matches actual export

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onUpdate: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
  currentName,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  // Update name when modal opens
  React.useEffect(() => {
    setName(currentName);
  }, [currentName, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.errors.nameRequired'));
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await updateProfile(user.id, { full_name: name.trim() });
      onUpdate();
      onClose();
      Alert.alert(t('common.success'), t('profile.updateSuccess'));
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(t('common.error'), t('profile.errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.editProfile')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color={colors.text.grey} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>{t('profile.fullName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('profile.namePlaceholder')}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    marginBottom: 24,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: 16,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
  },
  saveButton: {
    backgroundColor: colors.primary.yellow,
  },
  saveButtonText: {
    fontWeight: typography.weights.bold,
    color: "#FFF",
  },
});
