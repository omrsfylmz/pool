import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { CustomSplashScreen } from "../components/ui/SplashScreen";
import * as SplashScreen from "expo-splash-screen";

// Keep the native splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Hide native splash after a brief moment
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashFinish = async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <CustomSplashScreen onFinish={onSplashFinish} />
      </View>
    );
  }

  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
