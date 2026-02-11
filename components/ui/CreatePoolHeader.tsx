import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScreenHeader } from "./ScreenHeader";

interface CreatePoolHeaderProps {
  onClose?: () => void;
  onHelp?: () => void;
}

/**
 * CreatePoolHeader Component
 * Header for the create pool page with close and help buttons
 */
export const CreatePoolHeader: React.FC<CreatePoolHeaderProps> = ({
  onClose,
  onHelp,
}) => {
  const { t } = useTranslation();
  return (
    <ScreenHeader
      title={t('createPool.title')}
      leftIcon="back"
      onLeftPress={onClose}
      rightIcon="question-circle"
      onRightPress={onHelp}
    />
  );
};

const styles = StyleSheet.create({});

