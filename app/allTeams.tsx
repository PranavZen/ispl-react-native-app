import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AllTeams() {
  return (
    <View style={styles.container}>
      <Text>allTeams Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#182046",
    },
  });