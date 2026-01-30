import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import "../services/i18n"; // Initialize i18n

export default function RootLayout() {
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
