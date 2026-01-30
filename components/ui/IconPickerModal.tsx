import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { borderRadius, colors, shadows, typography } from "../../constants/theme";

export interface FoodIcon {
  name: string;
  label: string;
  emoji: string;
}

export const FOOD_ICONS: FoodIcon[] = [
  { name: 'utensils', label: 'Utensils', emoji: '🍴' },
  { name: 'pizza-slice', label: 'Pizza', emoji: '🍕' },
  { name: 'hamburger', label: 'Burger', emoji: '🍔' },
  { name: 'coffee', label: 'Coffee', emoji: '☕' },
  { name: 'ice-cream', label: 'Ice Cream', emoji: '🍦' },
  { name: 'fish', label: 'Sushi', emoji: '🍣' },
  { name: 'apple-alt', label: 'Fruit', emoji: '🍎' },
  { name: 'drumstick-bite', label: 'Chicken', emoji: '🍗' },
  { name: 'cheese', label: 'Cheese', emoji: '🧀' },
  { name: 'hotdog', label: 'Hot Dog', emoji: '🌭' },
  { name: 'pepper-hot', label: 'Spicy', emoji: '🌶️' },
  { name: 'carrot', label: 'Veggie', emoji: '🥕' },
  { name: 'bread-slice', label: 'Bread', emoji: '🍞' },
  { name: 'cookie', label: 'Dessert', emoji: '🍪' },
  { name: 'wine-glass', label: 'Drinks', emoji: '🍷' },
  { name: 'lemon', label: 'Citrus', emoji: '🍋' },
];

interface IconPickerModalProps {
  visible: boolean;
  selectedIcon: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  visible,
  selectedIcon,
  onSelect,
  onClose,
}) => {
  const handleSelectIcon = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select an Icon</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color={colors.text.grey} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Optional - Choose an icon for your food</Text>

          {/* Icon Grid */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.iconGrid}
            showsVerticalScrollIndicator={false}
          >
            {FOOD_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                style={[
                  styles.iconButton,
                  selectedIcon === icon.name && styles.iconButtonSelected,
                ]}
                onPress={() => handleSelectIcon(icon.name)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconCircle,
                    selectedIcon === icon.name && styles.iconCircleSelected,
                  ]}
                >
                  <FontAwesome5
                    name={icon.name}
                    size={28}
                    color={
                      selectedIcon === icon.name
                        ? colors.text.dark
                        : colors.primary.yellow
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.iconLabel,
                    selectedIcon === icon.name && styles.iconLabelSelected,
                  ]}
                >
                  {icon.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Use Default Button */}
          <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => handleSelectIcon('utensils')}
            activeOpacity={0.8}
          >
            <Text style={styles.defaultButtonText}>Use Default (Utensils)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const iconSize = (width - 80) / 4; // 4 icons per row with padding

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    padding: 5,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  scrollView: {
    maxHeight: 400,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    paddingTop: 5,
  },
  iconButton: {
    width: iconSize,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButtonSelected: {
    // Visual feedback for selected state (handled by iconCircle)
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconCircleSelected: {
    backgroundColor: colors.primary.yellow,
    borderColor: colors.primary.yellowDark,
  },
  iconLabel: {
    fontSize: 11,
    color: colors.text.grey,
    textAlign: 'center',
    fontWeight: typography.weights.medium,
  },
  iconLabelSelected: {
    color: colors.text.dark,
    fontWeight: typography.weights.bold,
  },
  defaultButton: {
    margin: 20,
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  defaultButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.grey,
  },
});
