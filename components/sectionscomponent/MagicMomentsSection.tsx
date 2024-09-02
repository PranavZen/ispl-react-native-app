import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SectionTitle from "./SectionTitle";
import HeighlightsCard from "../cardcomponents/SliderCard";
import Swiper from "react-native-swiper";

export default function magicmommentsection() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://my.ispl-t10.com/api/video-master/all-vedios")
      .then((response) => response.json())
      .then((data) => {
        const magicMomentVideos = data.data["all-video"].filter(
          (video: { category_names: string }) =>
            video.category_names === "Magic-Moments"
        );
        setVideos(magicMomentVideos);
      });
  }, []);
  return (
    <View style={styles.mainWrap}>
      <View style={styles.mainContainer}>
        <SectionTitle
          titleText="Magic Moments"
          readMore="Read More"
          targetScreen="registration"
        />

        <Swiper
          autoplay={true}
          loop={true}
          autoplayTimeout={5}
          dot={false}
          showsPagination={false}
        >
          {videos.map((video, index) => (
            <View key={index}>
              <HeighlightsCard
                mainTitle={video.title}
                backgroundImg={`https://my.ispl-t10.com/images/videos/thumbnail/${video.thumbnail}`}
                date={video.date}
                matchLink={video.video_link}
              />
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainWrap: {
    height: 420,
    paddingTop: 10,
  },
  mainContainer: {
    paddingTop: 8,
    height: "100%",
  },
});
