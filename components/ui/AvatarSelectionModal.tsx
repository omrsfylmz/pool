import React from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { AVATAR_MAP } from "../../constants/avatars";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  currentAvatar?: string;
}

export const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentAvatar,
}) => {
  const { t } = useTranslation();
  const avatars = Object.keys(AVATAR_MAP).filter((key) => key !== "default");

  const renderAvatarItem = ({ item }: { item: string }) => {
    const isSelected = item === currentAvatar;
    return (
      <TouchableOpacity
        style={[styles.avatarItem, isSelected && styles.selectedAvatarItem]}
        onPress={() => onSelect(item)}
      >
        <Text style={styles.avatarEmoji}>{AVATAR_MAP[item]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.centeredView}>
        <TouchableWithoutFeedback>
            <View style={styles.modalView}>
            <Text style={styles.title}>{t('profile.selectAvatar')}</Text>
            
            <FlatList
                data={avatars}
                renderItem={renderAvatarItem}
                keyExtractor={(item) => item}
                numColumns={4}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: 20,
    color: colors.text.dark,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  avatarItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border.light,
    ...shadows.button,
  },
  selectedAvatarItem: {
    borderColor: colors.primary.yellow,
    backgroundColor: colors.primary.yellowLight,
    borderWidth: 3,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  closeButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
