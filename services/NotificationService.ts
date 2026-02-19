import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from './i18n';

const LOG_PREFIX = '[NotificationService]';

function getIOSMajorVersion(): number | null {
  if (Platform.OS !== 'ios') return null;
  if (typeof Platform.Version === 'number') return Platform.Version;
  const parsed = Number.parseInt(Platform.Version, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isIOS16OrNewer(): boolean {
  const major = getIOSMajorVersion();
  return major === null || major >= 16;
}

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token: string | undefined;

  if (!isIOS16OrNewer()) {
    console.warn(`${LOG_PREFIX} iOS version is below 16, skipping push registration.`);
    return;
  }

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } catch (error) {
      console.error(`${LOG_PREFIX} Error setting Android notification channel:`, error);
      return;
    }
  }

  if (Device.isDevice) {
    let existingStatus: Notifications.PermissionStatus;
    try {
      const permissions = await Notifications.getPermissionsAsync();
      existingStatus = permissions.status;
    } catch (error) {
      console.error(`${LOG_PREFIX} Error reading notification permissions:`, error);
      return;
    }

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      } catch (error) {
        console.error(`${LOG_PREFIX} Error requesting notification permissions:`, error);
        return;
      }
    }
    if (finalStatus !== 'granted') {
      return;
    }

    // Check if running in Expo Go on Android
    // The warning says: Android Push notifications ... was removed from Expo Go with SDK 53
    if (Platform.OS === 'android' && Constants.executionEnvironment === 'storeClient') {
      return;
    }

    try {
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // We wrap this in try-catch because on some devices/configs it might still throw or warn aggressively.
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: '0c0fcc48-2ce4-4bb4-abda-0cde3df99941' });
      token = tokenData.data;
    } catch (error) {
       console.error(`${LOG_PREFIX} Error getting push token:`, error);
       // Suppress error in dev/Expo Go if it happens
    }

  } else {
    console.log(`${LOG_PREFIX} Must use physical device for Push Notifications`);
  }

  return token;
}

export async function scheduleDailyNotification() {
  if (!isIOS16OrNewer()) {
    console.warn(`${LOG_PREFIX} iOS version is below 16, skipping daily notifications.`);
    return;
  }

  try {
    // Check if daily notification is already scheduled
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const lunchTitle = i18n.t("notifications.lunch.title");
    const lunchNotifications = scheduled.filter(n => n.content.title === lunchTitle);

    // If we have 5 notifications, assume we are already set up correctly for weekdays
    // If we have fewer (e.g. 1 from old daily system) or more, reset them.
    if (lunchNotifications.length === 5) return;

    // Clear existing/old notifications
    for (const n of lunchNotifications) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }

    // Schedule for Mon (2) to Fri (6)
    for (let weekday = 2; weekday <= 6; weekday++) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: lunchTitle,
            body: i18n.t("notifications.lunch.body"),
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekday,
            hour: 11,
            minute: 45,
          },
        });
      } catch (error) {
        console.error(`${LOG_PREFIX} Error scheduling daily notification for weekday ${weekday}:`, error);
      }
    }

  } catch (error) {
    console.error(`${LOG_PREFIX} Error scheduling daily notification:`, error);
  }
}

export async function schedulePoolCompletionNotification(
  poolId: string,
  poolTitle: string,
  endsAt: string
) {
  if (!isIOS16OrNewer()) {
    console.warn(`${LOG_PREFIX} iOS version is below 16, skipping pool completion scheduling.`);
    return;
  }

  try {
    const parsedDate = Date.parse(endsAt);
    if (Number.isNaN(parsedDate)) {
      console.error(`${LOG_PREFIX} Invalid endsAt date for pool completion notification:`, endsAt);
      return;
    }

    const triggerDate = new Date(parsedDate);
    const now = new Date();

    // If pool ends in the past or very soon (less than 10s), don't schedule
    if (triggerDate.getTime() - now.getTime() < 10000) return;

    // Check if already scheduled to avoid duplicates
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const isAlreadyScheduled = scheduled.some(
      (n) => n.content.data?.poolId === poolId
    );

    if (isAlreadyScheduled) {
       // Optional: Update it if time changed? For now, just skip.
       return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications.poolComplete.title"),
        body: i18n.t("notifications.poolComplete.body", { poolTitle }),
        sound: true,
        data: { url: `/results?poolId=${poolId}`, poolId },
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate 
      },
    });

  } catch (error) {
    console.error(`${LOG_PREFIX} Error scheduling pool completion notification:`, error);
  }
}
