import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function More() {
  return (
    <View style={styles.container}>
      <Text>More Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#182046",
    },
  });