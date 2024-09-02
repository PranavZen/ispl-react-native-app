import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Topbar from '@/components/Topbar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
       <Topbar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="login" options={{ headerShown: true }} /> */}
        {/* <Stack.Screen name="registration" options={{ headerShown: true }} /> */}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        {/* <Stack.Screen name="pointsTable" options={{ headerShown: false }} /> */}
        <Stack.Screen name="allTeams" options={{ headerShown: false }} />
        <Stack.Screen name="newsnevents" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
