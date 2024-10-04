import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { TabView, SceneMap, Route } from "react-native-tab-view";
import Table from "../sectionscomponent/table/Table";
import PlayerStatsTable from "../sectionscomponent/table/PlayerStatsTable";

const FirstRoute: React.FC = () => (
  <View style={[{ backgroundColor: "#fff" }]}>
    <Text>kjsd bckjdsb cdsj c</Text>
    <Text>kjsd bckjdsb cdsj c</Text>
  </View>
);

interface TabRoute extends Route {
  key: string;
  title: string;
}

const TabViewExample: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<TabRoute[]>([
    { key: "first", title: "Results" },
    { key: "second", title: "Points Table" },
    { key: "thired", title: "Player Stats" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        first: FirstRoute,
        second: Table,
        thired: PlayerStatsTable,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 680,
    flex : 1
  },
});

export default TabViewExample;
