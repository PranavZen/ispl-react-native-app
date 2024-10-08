// import TimeSlot from "@/components/goldenpagecomponents/TimeSlot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
// import animationData from "../components/anime/confitee.json";
import LottieView from "lottie-react-native";

const GoldenPage: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [isplId, setIsplId] = useState<string>("");
  const [userNameSlot, setUserNameSlot] = useState<string | null>(null);
  const [userSlotId, setUserSlotId] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [seasonTypes, setSeasonTypes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlotDate, setSelectedSlotDate] = useState<string | null>(null);
  const [selectedSlotStartTime, setSelectedSlotStartTime] = useState<
    string | null
  >(null);
  const [selectedSlotEndTime, setSelectedSlotEndTime] = useState<string | null>(
    null
  );
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean>(false);
  const [isTicketId, setIsTicketId] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const generateQRCodeData = () => {
    return JSON.stringify(userNameSlot);
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("apiToken");
      return token ? token : null;
    } catch (error) {
      console.error("Error retrieving token", error);
      return null;
    }
  };

  const fetchData = async () => {
    const token = await getToken();
    if (!token) {
      console.error("No token found. User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://my.ispl-t10.com/api/user-dashboard-api",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.user_data;
      if (
        response.data.user_slots_master &&
        response.data.user_slots_master.length > 0
      ) {
        const slotMaster = response.data.user_slots_master[0];

        setSelectedSlotDate(response.data.formatted_date || "");
        setSelectedSlotStartTime(response.data.formatted_start_time || "");
        setSelectedSlotEndTime(response.data.formatted_end_time || "");
        setUserNameSlot(slotMaster.user_name || "");
        setUserSlotId(response.data.venue_name || "");
        setIsSlotAvailable(true);
      } else {
        setIsSlotAvailable(false);
      }

      setPlayerName(`${userData.first_name} ${userData.surname}`);
      setPlayerId(userData.user_name);
      const cityNameArray = JSON.parse(userData.cities_states_names);
      setCityName(cityNameArray[0]);
      setSeasonTypes(response.data.season);
      setIsTicketId(userData.ticket_id);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized access - please log in again.");
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchData();
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.contentContainer}>
        <View style={styles.messageContainer}>
          {loading ? (
            <Text style={styles.goldenMsg}>Loading...</Text>
          ) : (
            <>
              {isTicketId === 2 ? (
                <Text style={styles.goldenMsg}>
                  Congratulations !!! Here is your Green Ticket... Now you are
                  eligible to attend the Zone Trials. The schedule of the Zone
                  final trials is available on the website. For any information,
                  please feel free to contact us.
                </Text>
              ) : (
                // <TimeSlot />
                ""
              )}
            </>
          )}
        </View>

        <View style={styles.emailContent}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={{
                uri: "https://my.ispl-t10.com/assets/img/logo.png",
              }}
              alt="Logo"
            />
            <Text style={styles.welcomeText}>
              Welcome to Indian Street Premiere League!
            </Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.respText}>
              Dear <Text style={styles.playerName}>{playerName}</Text>,
            </Text>

            <Text style={styles.paragraph}>
              Congratulations on completing your online registration for the
              Indian Street Premiere League! We are thrilled to have you on
              board and look forward to an exciting journey together.
            </Text>
            <Text style={styles.paragraph}>
              Here at ISPL, we are dedicated to providing a platform for street
              players to showcase their talents and take their cricketing
              journey to new heights. Your participation adds immense value to
              our league, and we are excited to witness the skills and passion
              you bring to the game.
            </Text>
            <Text style={styles.paragraph}>
              As a registered player, you are now part of a dynamic community
              that shares a common love for cricket. Get ready for an
              unforgettable experience filled with opportunities, challenges,
              and camaraderie.
            </Text>
            <Text style={styles.paragraph}>Here's what to expect next:</Text>
          </View>

          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <View style={styles.ticketContainer}>
              <Image
                source={{
                  uri: `https://my.ispl-t10.com/assets/img/${
                    isTicketId === 2 ? "green" : "golden"
                  }-ticket.png`,
                }}
                style={styles.ticketImage}
              />
              {isTicketId === 2 ? (
                <View style={styles.lottieWrap}>
                  <LottieView
                    source={require("../components/anime/confitee.json")}
                    autoPlay
                    loop
                    style={{ width: 400, height: 400 }}
                  />
                </View>
              ) : (
                ""
              )}
              <View style={styles.ticketTextContainer}>
                <Text style={styles.ticketText}>
                  {isTicketId === 4
                    ? "Spot Registration Ticket"
                    : `${isTicketId === 2 ? "GREEN" : "GOLDEN"} TICKET`}
                </Text>
                <Text style={styles.seasonText}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    `Season ${seasonTypes}`
                  )}
                </Text>
                <Text style={styles.playerInfo}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    `MR. ${playerName}`
                  )}
                </Text>
                <View style={styles.hr} />

                {isTicketId === 2 ? (
                  ""
                ) : (
                  <View style={styles.qrCodeWrap}>
                    {userNameSlot === null ? (
                      ""
                    ) : (
                      <QRCode
                        value={generateQRCodeData()}
                        size={110}
                        backgroundColor="transparent"
                      />
                    )}
                  </View>
                )}
                <Text style={styles.playerId}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    playerId
                  )}{" "}
                  <Text style={styles.cityName}>
                    (
                    {loading ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      cityName
                    )}
                    )
                  </Text>
                </Text>
                {isTicketId === 2 ? null : (
                  <Text style={styles.finalTextSlotTicket}>
                    {userSlotId}{" "}
                    {isSlotAvailable ? (
                      <>
                        {selectedSlotDate}
                        {"\n"}
                        {selectedSlotStartTime} to {selectedSlotEndTime}
                      </>
                    ) : (
                      <Text></Text>
                    )}
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.body}>
            <Text style={styles.paragraph}>
              Your city trials will begin shortly. Kindly confirm your trials
              slot for your selected city. Best of luck for your trials.
            </Text>
            <Text style={styles.paragraph}>
              Feel free to reach out if you have any questions or need
              assistance along the way. Once again, welcome to the Indian Street
              Premiere League family!
            </Text>
            <Text style={styles.finalNote}>
              Best regards,
              {"\n"}
              Indian Street Premiere League Team
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  ticketTextContainer: {
    position: "absolute",
    top: "5%",
    height: "100%",
    justifyContent: "center",
  },

  contentContainer: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    flex: 1,
    position: "relative",
    paddingBottom: 40,
    paddingTop: 40,
  },

  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  goldenMsg: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  emailContent: {
    marginTop: 10,
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 22,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  body: {
    marginTop: 20,
  },
  respText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  playerName: {
    color: "#fff",
    fontWeight: "bold",
  },
  paragraph: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 16,
  },
  ticketContainer: {
    marginTop: 120,
    marginBottom: 110,
    alignItems: "center",
    position : "relative"
  },
  lottieWrap:{
    position : "absolute",
  },
  ticketImage: {
    width: 600,
    height: 380,
    resizeMode: "contain",
    transform: [{ rotate: "90deg" }],
  },
  ticketText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 5,
  },
  seasonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  playerInfo: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 0,
    textAlign: "center",
  },
  hr: {
    width: "100%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  qrCodeWrap: {
    alignItems: "center",
    marginVertical: 10,
  },
  playerId: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  cityName: {
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  finalTextSlotTicket: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 0,
    textAlign: "center",
    lineHeight: 22,
  },
  finalNote: {
    color: "#fff",
    marginTop: 10,
  },
  skeleton: {
    height: 100,
    width: 800,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});

export default GoldenPage;
function fetchData() {
  throw new Error("Function not implemented.");
}
