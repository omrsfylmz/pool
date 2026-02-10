import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  { name: 'silverware-fork-knife', label: 'Utensils', emoji: '🍴' },
  { name: 'pizza', label: 'Pizza', emoji: '🍕' },
  { name: 'hamburger', label: 'Burger', emoji: '🍔' },
  { name: 'coffee', label: 'Coffee', emoji: '☕' },
  { name: 'ice-cream', label: 'Ice Cream', emoji: '🍦' },
  { name: 'fish', label: 'Sushi', emoji: '🍣' },
  { name: 'food-apple', label: 'Fruit', emoji: '🍎' },
  { name: 'food-drumstick', label: 'Chicken', emoji: '🍗' },
  { name: 'cheese', label: 'Cheese', emoji: '🧀' },
  { name: 'food-hot-dog', label: 'Hot Dog', emoji: '🌭' },
  { name: 'chili-hot', label: 'Spicy', emoji: '🌶️' },
  { name: 'carrot', label: 'Veggie', emoji: '🥕' },
  { name: 'bread-slice', label: 'Bread', emoji: '🍞' },
  { name: 'cookie', label: 'Dessert', emoji: '🍪' },
  { name: 'glass-cocktail', label: 'Drinks', emoji: '🍷' },
  { name: 'fruit-citrus', label: 'Citrus', emoji: '🍋' },
  { name: 'taco', label: 'Taco', emoji: '🌮' },
  { name: 'food-steak', label: 'Doner/Kebab', emoji: '🥙' },
  { name: 'noodles', label: 'Soup/Stew', emoji: '🍲' },
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
              <MaterialCommunityIcons name="close" size={24} color={colors.text.grey} />
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
                  <MaterialCommunityIcons
                    name={icon.name as any}
                    size={28}
                    color={
                      selectedIcon === icon.name
                        ? '#FFFFFF' // White icon on yellow background
                        : colors.primary.yellowDark
                    }
                  />
                </View>

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
const iconSize = (width - 60) / 4; // 4 icons per row

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
    justifyContent: 'flex-end', // Bottom sheet style
  },
  modalContainer: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '85%',
    paddingBottom: 30, // Safe area
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.veryLight,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.background.light,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.grey,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: -5,
  },
  scrollView: {
    maxHeight: 500,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: iconSize,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButtonSelected: {
    transform: [{ scale: 1.05 }], // Slight scale effect
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...shadows.button, // Add shadow
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconCircleSelected: {
    backgroundColor: colors.primary.yellow,
    shadowColor: colors.primary.yellow,
    shadowOpacity: 0.5,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  iconLabel: {
    fontSize: 12,
    color: colors.text.grey,
    textAlign: 'center',
    fontWeight: typography.weights.medium,
  },
  iconLabelSelected: {
    color: colors.text.dark,
    fontWeight: typography.weights.bold,
  },
  defaultButton: {
    margin: 24,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background.main,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  defaultButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.dark,
  },
});
