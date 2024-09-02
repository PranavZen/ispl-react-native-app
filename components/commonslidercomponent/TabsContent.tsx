import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import Tabs from "../sectionscomponent/tabsbox/Tabs";
import { IconResults } from "./IconResults";
import { IconResultsOne } from "./IconResultsOne";
import { IconResultsTwo } from "./IconResultsTwo";
const tabIcons = {
  Results: <IconResults />,
  IconResultsOne: <IconResultsOne />,
  IconResultsTwo: <IconResultsTwo />,
};
export default function TabsContent() {
  return (
    <View style={styles.container}>
      <Text>TabsContent</Text>
      <Tabs>
        <View
          style={styles.tabContainer}
          label="Results"
          spanImg={tabIcons.Results}
        >
          <View style={styles.tabHeader}>
            <Text style={styles.tabLabel}>Results</Text>
          </View>
          <View style={styles.tabContent}>
            <Text>Tab 1</Text>
            <Text>Tab 1</Text>
          </View>
        </View>
        <View
          style={styles.tabContainer}
          label="Points Table"
          spanImg={tabIcons.IconResultsOne}
        >
          <View style={styles.tabHeader}>
            <Text style={styles.tabLabel}>Points Table</Text>
          </View>
          <View style={styles.tabContent}>
            <Text>Tab 100000000000</Text>
            <Text>Tab 100000000000</Text>
          </View>
        </View>
        <View
          style={styles.tabContainer}
          label="Player Stats"
          spanImg={tabIcons.IconResultsTwo}
        >
          <View style={styles.tabHeader}>
            <Text style={styles.tabLabel}>Player Stats</Text>
          </View>
          <View style={styles.tabContent}>
            <Text>Tab 30000000000</Text>
            <Text>Tab 30000000000</Text>
          </View>
        </View>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  tabContainer: {
    padding: 16,
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tabLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
});
