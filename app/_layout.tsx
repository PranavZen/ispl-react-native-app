import {
  DarkTheme,
  DefaultTheme,
  NavigationProp,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import * as Updates from "expo-updates";

import { useColorScheme } from "@/hooks/useColorScheme";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Topbar from "@/components/Topbar";

SplashScreen.preventAutoHideAsync();
interface CustomHeaderProps {
  navigation: NavigationProp<any>;
  title: string;
}

function CustomHeader({ navigation, title }: CustomHeaderProps) {
  const handleBackPress = async () => {
    navigation.navigate("index"); // Redirect to home screen (tabs)
    // await Updates.reloadAsync(); // Reload the app
  };

  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#182046",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        onPress={handleBackPress} // Use custom back press handler
        style={{ paddingRight: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={{ color: "#fff", fontSize: 20 }}>{title}</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Topbar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Login" />
            ),
          })}
        />
        <Stack.Screen
          name="glodenpage"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Dashboard" />
            ),
          })}
        />
        <Stack.Screen
          name="matchcenter"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Match Center" />
            ),
          })}
        />
        <Stack.Screen
          name="allTeams"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="All Tems" />
            ),
          })}
        />
        <Stack.Screen
          name="allvideos"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="All Videos" />
            ),
          })}
        />
        <Stack.Screen
          name="pointsTable"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Points Table" />
            ),
          })}
        />
        <Stack.Screen
          name="newsnevents"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="All News" />
            ),
          })}
        />
        <Stack.Screen
          name="TeamDetail"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Team Details" />
            ),
          })}
        />
        <Stack.Screen
          name="highlightsmainscreen"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Highlights" />
            ),
          })}
        />
        <Stack.Screen
          name="magicmomentsmainscreen"
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="Magic Moments" />
            ),
          })}
        />
      </Stack>
    </ThemeProvider>
  );
}
