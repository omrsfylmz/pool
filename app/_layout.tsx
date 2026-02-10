import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "../services/NotificationService";


function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    // Check if the current route is in the public group (index, login, signup)
    // segments is empty for root index
    const inPublicGroup = segments.length === 0 || segments[0] === 'login' || segments[0] === 'signup';

    if (session && inPublicGroup) {
      // Redirect to dashboard if logged in and in a public route
      router.replace('/(tabs)/dashboard');
    } else if (!session && !inPublicGroup) {
      // Redirect to index if not logged in and not in a public route
      router.replace('/');
    }
  }, [session, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="signup" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

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
      <InitialLayout />
    </AuthProvider>
  );
}
