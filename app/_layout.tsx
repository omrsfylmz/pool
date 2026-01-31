import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "../services/NotificationService";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function setupNotifications() {
      await registerForPushNotificationsAsync();
      await scheduleDailyNotification();
    }
    setupNotifications();
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
