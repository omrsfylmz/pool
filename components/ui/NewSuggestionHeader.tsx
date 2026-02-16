import React from "react";
import { useTranslation } from "react-i18next";
import { ScreenHeader } from "./ScreenHeader";

interface NewSuggestionHeaderProps {
  onBack?: () => void;
}

/**
 * NewSuggestionHeader Component
 * Header for the new suggestion page with back button
 */
export const NewSuggestionHeader: React.FC<NewSuggestionHeaderProps> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <ScreenHeader
      title={t('headers.newSuggestion')}
      leftIcon="back"
      onLeftPress={onBack}
    />
  );
};
