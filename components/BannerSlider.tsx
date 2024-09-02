import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

interface BannerItem {
  title: string;
  description: string;
  imageUrl: string;
}

const banners: BannerItem[] = [
  {
    title: "AB CHALTE HAI STREET TO STADIUM",
    description:
      "ISPL is Committed to Bridging the gap between street cricket and stadium glory!",
    imageUrl:
      "https://www.ispl-t10.com/static/media/banner-3.bc691cf22fa2793723bb.webp",
  },
  {
    title: "AB CHALTE HAI STREET TO STADIUM",
    description:
      "ISPL is Committed to Bridging the gap between street cricket and stadium glory!",
    imageUrl:
      "https://www.ispl-t10.com/static/media/banner-2.1c9b2becdb48ef45491d.webp",
  },
  {
    title: "AB CHALTE HAI STREET TO STADIUM",
    description:
      "ISPL is Committed to Bridging the gap between street cricket and stadium glory!",
    imageUrl:
      "https://www.ispl-t10.com/static/media/banner-1.11c74a19d24a35e2380e.webp",
  },
];

const BannerSlider: React.FC = () => {
  const navigation = useNavigation();

  const renderBannerItem = (item: BannerItem) => (
    <View key={item.title} style={styles.bannerContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
      <View style={styles.overlay} />
      <View style={styles.textContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("registration")}>
          <Text style={styles.readMore}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.sliderContainer}>
      <Swiper
        autoplay={true}
        loop={true}
        autoplayTimeout={5}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {banners.map(renderBannerItem)}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 170,
  },
  bannerContainer: {
    position: "relative",
  },
  bannerImage: {
    width: screenWidth,
    height: 170,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textContent: {
    position: "absolute",
    bottom: 30,
    left: 10,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
    width : "70%"
  },
  readMore: {
    fontSize: 14,
    color: "#fbe29a",
    fontWeight: "800",
  },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: 30,
    height: 4,
    borderRadius: 4,
    marginBottom: -20,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 30,
    height: 4,
    borderRadius: 4,
    marginBottom: -20,
  },
});

export default BannerSlider;
