import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
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
      console.log('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    // console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleDailyNotification() {
  try {
    // Cancel all existing notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

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
    console.log("Daily notification scheduled");
  } catch (error) {
    console.error("Error scheduling daily notification:", error);
  }
}
