import React from "react";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "./ScreenHeader";

interface SharePoolHeaderProps {
  onBack?: () => void;
}

/**
 * SharePoolHeader Component
 * Header for the share pool page with back button
 */
export const SharePoolHeader: React.FC<SharePoolHeaderProps> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <ScreenHeader
      title={t('headers.sharePool')}
      leftIcon="back"
      onLeftPress={onBack}
    />
  );
};
