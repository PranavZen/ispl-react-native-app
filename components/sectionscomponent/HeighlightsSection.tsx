import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SectionTitle from "./SectionTitle";
import HeighlightsCard from "../cardcomponents/SliderCard";

interface Video {
  title: string;
  thumbnail: string;
  date: string;
  video_link: string;
  category_names: string;
}

export default function HighlightsSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    fetch("https://my.ispl.popopower.com/api/video-master/all-vedios")
      .then((response) => response.json())
      .then((data) => {
        const filteredVideos = data.data["all-video"].filter(
          (video: Video) => video.category_names === "Highlights"
        );
        setVideos(filteredVideos);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <View style={styles.mainWrap}>
      <View style={styles.mainContainer}>
        <SectionTitle
          titleText="Highlights"
          readMore="Read More"
          targetScreen="highlightsmainscreen"
        />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {videos.map((video, index) => (
            <HeighlightsCard
              mainTitle={video.title}
              backgroundImg={`https://my.ispl-t10.com/images/videos/thumbnail/${video.thumbnail}`}
              date={video.date}
              matchLink={video.video_link}
              key={index}
              title={""}
              customWidth={{ width: 300 }}
              padLeft={{paddingHorizontal: 5}}
            />
          ))}
        </ScrollView>
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
