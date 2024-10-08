import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AllTeamsInner() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch(
          "https://my.ispl-t10.com/api/team/team-list-mobile"
        );
        const data = await response.json();

        // Check if the data structure is as expected and update teams state
        if (data.status === "success" && Array.isArray(data.data.teams_data)) {
          setTeams(data.data.teams_data); // Access the correct teams data
        } else {
          console.error(
            "Failed to fetch teams, unexpected data structure:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of fetch success
      }
    }

    fetchTeams();
  }, []);

  const handleTeamPress = (team) => {
    navigation.navigate("TeamDetail", { team });
  };

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#003899" />
      ) : (
        <View style={styles.mainContainerWrap}>
          {teams.length > 0 ? ( // Check if teams array is not empty
            teams.map((team) => (
              <TouchableOpacity
                key={team.team_name}
                onPress={() => handleTeamPress(team)} // Pass the entire team object
                style={styles.boxWrap}
              >
                <View style={styles.box}>
                  <Image
                    source={{
                      uri: `https://my.ispl-t10.com/images/team-master/teams/${team.team_logo}`,
                    }}
                    style={styles.boxImg}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTeamsText}>No teams available</Text> // Message if no teams found
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#182046",
  },
  mainContainerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    gap: 5,
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
  boxWrap: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Add bottom margin for spacing
  },
  box: {
    width: width / 2.2, // Ensure box takes half the width
    height: width / 2, // Maintain aspect ratio
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 8
  },
  boxImg: {
    width: width / 3,
    height: width / 3,
  },
  noTeamsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});
