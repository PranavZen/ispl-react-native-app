import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TopSlider() {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>Street to Stadium</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/img.png")}
              style={styles.boxImg}
            />
          </View>
          <Text style={styles.boxText}>Match Highlights</Text>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/img2.png")}
              style={styles.boxImg}
            />
          </View>
          <Text style={styles.boxText}>League Match: 02</Text>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/img3.png")}
              style={styles.boxImg}
            />
          </View>
          <Text style={styles.boxText}>League Match: 02 </Text>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/img.png")}
              style={styles.boxImg}
            />
          </View>
          <Text style={styles.boxText}>League Match: 02</Text>
        </View>
        <View style={styles.boxWrap}>
          <View style={styles.box}>
            <Image
              source={require("../../assets/images/img2.png")}
              style={styles.boxImg}
            />
          </View>
          <Text style={styles.boxText}>Match Highlights</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 8,
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
    marginBottom: 20,
  },
  boxWrap: {
    width: 75,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: 5,
  },
  box: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FBE29A",
    overflow: "hidden",
  },
  boxImg: {
    width: 72,
    height: 72,
    objectFit: "cover",
  },
  boxText: {
    fontSize: 10,
    textAlign: "center",
    color: "#fff",
    width: 70,
  },
});
