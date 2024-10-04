import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AllTeams() {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>All Teams</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.boxWrap}>
          <View style={styles.box}> 
            <Image
              source={require("../../assets/images/mm.png")}
              style={styles.boxImg}
            />
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/kt.png")}
              style={styles.boxImg}
            />
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/kbs.png")}
              style={styles.boxImg}
            />
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/cs.png")}
              style={styles.boxImg}
            />
          </View>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/swp.png")}
              style={styles.boxImg}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    textTransform: "uppercase",
  },
  scrollView: {
    // paddingBottom: 25,
  },
  boxWrap: {
    width: 75,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: 20,
  },
  box: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  boxImg: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
});
