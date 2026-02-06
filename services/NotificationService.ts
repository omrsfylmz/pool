import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
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
       console.log('Error getting push token:', error);
       // Suppress error in dev/Expo Go if it happens
    }

  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleDailyNotification() {
  try {
    // Check if daily notification is already scheduled
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const hasDaily = scheduled.some(n => n.content.title === "🍔 Lunch Time!");

    if (hasDaily) return;

    // Schedule notification for 12:00 PM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🍔 Lunch Time!",
        body: "Don't forget to vote for today's lunch pool!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 11,
        minute: 45,
      },
    });

  } catch (error) {
    console.error("Error scheduling daily notification:", error);
  }
}

export async function schedulePoolCompletionNotification(
  poolId: string,
  poolTitle: string,
  endsAt: string
) {
  try {
    const triggerDate = new Date(endsAt);
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
        title: "Pool Complete! 🏁",
        body: `"${poolTitle}" has ended. Tap to see the winner!`,
        sound: true,
        data: { url: `/winner?poolId=${poolId}`, poolId },
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate 
      },
    });

  } catch (error) {
    console.error("Error scheduling pool completion notification:", error);
  }
}
