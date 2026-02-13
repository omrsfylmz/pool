import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScreenHeader } from "./ScreenHeader";

interface VoteHeaderProps {
  userAvatar?: string;
  onAvatarPress?: () => void;
}

/**
 * VoteHeader Component
 * Header for the vote page with user avatar, title, and search icon
 */
export const VoteHeader: React.FC<VoteHeaderProps> = ({
  userAvatar = "lion", // Default to key, not emoji
  onAvatarPress,
}) => {
  const { t } = useTranslation();
  return (
    <ScreenHeader
      title={t('headers.voteTitle')}
      subtitle={t('headers.voteSubtitle')}
      leftIcon="avatar"
      avatar={userAvatar}
      onLeftPress={onAvatarPress}
    />
  );
};

const styles = StyleSheet.create({});

