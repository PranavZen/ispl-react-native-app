import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Topbar() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.topBor}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.vectorIcon1}
          source={require("../assets/images/ISPL-season2-logo.png")}
        />
        <TouchableOpacity onPress={handlePress}>
          <Image source={require("../assets/images/profilePic.png")} style={styles.vectorIcon2}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBor: {
    backgroundColor: "#263572",
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems:"center"
  },
  vectorIcon1: {
    width: 30,
    height: 45,
  },
  vectorIcon2: {
    width: 35,
    height: 35,
  },
});
