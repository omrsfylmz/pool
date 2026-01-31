import { Stack } from "expo-router";
import React, { useState } from "react";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

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
