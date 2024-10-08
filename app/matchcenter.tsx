import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import MatchCard from "@/components/MatchCard"; // Adjust path as needed
import TeamPlayers from "@/components/TeamPlayers"; // Adjust path as needed
import { useRoute } from "@react-navigation/native";

// Helper function to format the date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

// Helper function to format the time
function formatTime(timeString: string | undefined): string {
  if (!timeString) return "Time Not Available"; // Handle undefined time string
  let [hours, minutes] = timeString.split(":");
  hours = parseInt(hours, 10).toString();
  const period = parseInt(hours) >= 12 ? "PM" : "AM";

  if (hours === "0") {
    hours = "12";
  } else if (parseInt(hours) > 12) {
    hours = (parseInt(hours) - 12).toString();
  }

  return `${hours}:${minutes} ${period}`;
}

// Main component
const TeamDetails: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string | undefined }; // Type-checking for ID
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null); // Holds match details
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]); // Holds team players

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          "https://my.ispl-t10.com/api/matches/results"
        );
        const matches = response.data.data.result;
        // Find the match with the given id
        const foundMatch = matches.find((m: any) => m.id === parseInt(id));
        setMatch(foundMatch);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    };

    const fetchTeamPlayers = async () => {
      try {
        const response = await axios.get(
          `https://my.ispl-t10.com/api/matches/match-center/${id}`
        );
        setTeamPlayers(response.data.data);
      } catch (error) {
        console.error("Error fetching team players:", error);
      }
    };

    fetchMatches();
    fetchTeamPlayers();
  }, [id]);

  const getWinMessage = (match: any) => {
    if (match.team_one_scrore > match.team_two_scrore) {
      return `${match.from_team_name.toUpperCase()} WON BY ${
        match.team_one_scrore - match.team_two_scrore
      } RUNS`;
    } else if (match.team_one_scrore < match.team_two_scrore) {
      return `${match.to_team_name.toUpperCase()} WON BY ${
        match.team_two_scrore - match.team_one_scrore
      } RUNS`;
    }
    return "MATCH TIED";
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : !match ? (
        <Text>No match found</Text>
      ) : (
        <>
          <MatchCard
            key={match.id}
            team_one_scrore={match.team_one_scrore}
            team_one_wicket={match.team_one_wicket}
            team_one_over={match.team_one_over}
            team_two_scrore={match.team_two_scrore}
            team_two_wicket={match.team_two_wicket}
            team_two_over={match.team_two_over}
            match_date={formatDate(match.match_date)}
            match_time={formatTime(match.match_time)}
            win_message={getWinMessage(match)}
            stadium_name={match.stadium_name}
            to_team_name={match.to_team_name}
            to_team_logo={match.to_team_logo}
            from_team_logo={match.from_team_logo}
          />
          <TeamPlayers teamPlayers={teamPlayers} />
        </>
      )}
    </ScrollView>
  );
};

export default TeamDetails;
