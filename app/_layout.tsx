import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n
import { scheduleDailyNotification } from "../services/NotificationService";


function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

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
  }, [session, loading, segments, router]);

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

  function getNotificationUrl(response: Notifications.NotificationResponse | null): string | null {
    const data = response?.notification?.request?.content?.data;
    if (!data || typeof data !== 'object') return null;
    const maybeUrl = (data as Record<string, unknown>).url;
    return typeof maybeUrl === 'string' ? maybeUrl : null;
  }

  useEffect(() => {
    async function setupNotifications() {
      try {
        await scheduleDailyNotification();
      } catch (error) {
        console.error('[RootLayout] Error scheduling daily notifications:', error);
      }

      try {
        // Handle cold start notification
        const response = await Notifications.getLastNotificationResponseAsync();
        const url = getNotificationUrl(response);
        if (!url) return;

        // Add a small delay to allow auth to settle/hydration to complete
        setTimeout(() => {
          router.push(url as any);
        }, 1000);
      } catch (error) {
        console.error('[RootLayout] Error handling cold-start notification:', error);
      }
    }

    setupNotifications();

    // Handle notification clicks while app is in foreground/background
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      try {
        const url = getNotificationUrl(response);
        if (url) {
          router.push(url as any);
        }
      } catch (error) {
        console.error('[RootLayout] Error handling notification response:', error);
      }
    });

    return () => subscription.remove();
  }, [router]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
