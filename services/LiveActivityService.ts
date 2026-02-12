import * as LiveActivity from 'expo-live-activity';
import { Platform } from 'react-native';

let currentActivityId: string | null = null;

/**
 * Start a Live Activity countdown for a pool.
 * Shows on Lock Screen and Dynamic Island (iPhone 14 Pro+).
 * No-ops gracefully on Android and iOS < 16.2.
 */
export function startPoolLiveActivity(
  poolTitle: string,
  poolDescription: string,
  endsAt: string
): string | undefined {
  if (Platform.OS !== 'ios') return undefined;

  try {
    const endDate = new Date(endsAt).getTime();

    const state: LiveActivity.LiveActivityState = {
      title: poolTitle,
      subtitle: poolDescription || 'Vote before time runs out! 🍽️',
      progressBar: {
        date: endDate,
      },
      imageName: 'pool_icon',
      dynamicIslandImageName: 'pool_icon_di',
    };

    const config: LiveActivity.LiveActivityConfig = {
      backgroundColor: '#1A1A2E',
      titleColor: '#FFFFFF',
      subtitleColor: '#CCCCCC',
      progressViewTint: '#EEAD2B',
      progressViewLabelColor: '#FFFFFF',
      deepLinkUrl: '/vote',
      timerType: 'digital',
    };

    const activityId = LiveActivity.startActivity(state, config);
    currentActivityId = activityId ? String(activityId) : null;
    return activityId ? String(activityId) : undefined;
  } catch (error) {
    console.log('Failed to start Live Activity:', error);
    return undefined;
  }
}

/**
 * Update the Live Activity with new pool info (e.g. title change).
 */
export function updatePoolLiveActivity(
  title: string,
  subtitle: string,
  endsAt: string
) {
  if (!currentActivityId || Platform.OS !== 'ios') return;

  try {
    LiveActivity.updateActivity(currentActivityId, {
      title,
      subtitle,
      progressBar: { date: new Date(endsAt).getTime() },
      imageName: 'pool_icon',
      dynamicIslandImageName: 'pool_icon_di',
    });
  } catch (error) {
    console.log('Failed to update Live Activity:', error);
  }
}

/**
 * Stop the Live Activity and show a completion message.
 * The final state persists briefly on the Lock Screen before auto-dismissing.
 */
export function stopPoolLiveActivity(winnerMessage?: string) {
  if (!currentActivityId || Platform.OS !== 'ios') return;

  try {
    LiveActivity.stopActivity(currentActivityId, {
      title: '🏁 Pool Complete!',
      subtitle: winnerMessage || 'Tap to see the results!',
      progressBar: { progress: 1.0 },
      imageName: 'pool_icon',
      dynamicIslandImageName: 'pool_icon_di',
    });
    currentActivityId = null;
  } catch (error) {
    console.log('Failed to stop Live Activity:', error);
  }
}

/**
 * Get the current Live Activity ID (null if none active).
 */
export function getCurrentActivityId(): string | null {
  return currentActivityId;
}

/**
 * Listen for Live Activity state changes (active, ended, dismissed, etc.)
 * Useful for cleanup when user manually dismisses the activity.
 */
export function addActivityStateListener(
  callback: (state: string) => void
) {
  if (Platform.OS !== 'ios') return undefined;

  try {
    return LiveActivity.addActivityUpdatesListener((event) => {
      callback(event.activityState);
      if (event.activityState === 'ended' || event.activityState === 'dismissed') {
        currentActivityId = null;
      }
    });
  } catch (error) {
    console.log('Failed to add activity listener:', error);
    return undefined;
  }
}
