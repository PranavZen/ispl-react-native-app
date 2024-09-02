import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import SectionTitle from "./SectionTitle";

export default function NewsnEvents() {
  return (
    <View style={styles.container}>
      <SectionTitle
        titleText="News & Events"
        readMore="Read More"
        targetScreen="newsnevents"
      />
      <View style={styles.wrap}>
        <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        />
        <View style={styles.newsTextWrap}>
          <Text style={styles.newsTag}>News</Text>
          <Text style={styles.newsDesc}>
            Saif Ali Khan Talks About his Father Teaching him Catching Cricket
            Ball | ISPL 2024 | Cricket News
          </Text>
          <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
        </View>
      </View>
      <View style={styles.wrap}>
        <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        />
        <View style={styles.newsTextWrap}>
          <Text style={styles.newsTag}>News</Text>
          <Text style={styles.newsDesc}>
            Saif Ali Khan Talks About his Father Teaching him Catching Cricket
            Ball | ISPL 2024 | Cricket News
          </Text>
          <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
        </View>
      </View>
      <View style={styles.wrap}>
        <Image
          source={require("../../assets/images/news1.jpg")}
          style={styles.newsImg}
        />
        <View style={styles.newsTextWrap}>
          <Text style={styles.newsTag}>News</Text>
          <Text style={styles.newsDesc}>
            Saif Ali Khan Talks About his Father Teaching him Catching Cricket
            Ball | ISPL 2024 | Cricket News
          </Text>
          <Text style={styles.newsLink}>Read More &gt;&gt;</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  wrap: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  newsImg: {
    height: "100%",
    width: "27%",
    borderRadius: 8,
    objectFit : "cover"
  },
  newsTextWrap: {
    width: "70%",
  },
  newsTag: {
    color: "#fbe29a",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  newsDesc: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
    lineHeight : 24
  },
  newsLink: {
    color: "#fbe29a",
    fontSize: 14,
    fontWeight: "500",
  },
});
