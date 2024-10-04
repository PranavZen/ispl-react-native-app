import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

interface MenuItem {
  id: string;
  title: string;
  screen: string;
}

const menuItems: MenuItem[] = [
  { id: "1", title: "Videos", screen: "allvideos" },
  { id: "2", title: "News", screen: "allnews" },
  { id: "3", title: "Teams", screen: "teams" },
  {
    id: "4",
    title: "Match Center",
    screen: "https://example.com/match-center",
  },
  { id: "5", title: "Login", screen: "login" },
  { id: "6", title: "Dashboard", screen: "glodenpage" },
  { id: "7", title: "Logout", screen: "index" },
];

const More: React.FC = () => {
  const navigation = useNavigation();
  const handlePress = (screen: string) => {
    navigation.navigate(screen);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.screen)}
      style={styles.menuItem}
    >
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#182046",
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: "#fbe29a",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#182046",
    textAlign: "center",
  },
});

export default More;
