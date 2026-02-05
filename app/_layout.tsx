import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "../services/NotificationService";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function setupNotifications() {
      // Basic setup
      await registerForPushNotificationsAsync();
      await scheduleDailyNotification();
    }
    setupNotifications();

    // Handle notification clicks
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      if (url) {
        router.push(url);
      }
    });

    return () => subscription.remove();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <Stack 
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
