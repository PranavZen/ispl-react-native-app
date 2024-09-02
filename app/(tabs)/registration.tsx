import { Picker } from "@react-native-picker/picker";
import { useNavigation, CommonActions } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, RefreshControl } from "react-native";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Linking } from "react-native";
import { ImageBackground } from "react-native";
import Toast from "react-native-toast-message";

interface FormData {
  first_name: string;
  surname: string;
  mobile_number: string;
  date_of_birth: string;
  email: string;
  state_name: string;
  cities_states_id: string;
  zone_name: string;
  password: string;
  password_confirmation: string;
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    surname: "",
    mobile_number: "",
    date_of_birth: "",
    email: "",
    state_name: "",
    cities_states_id: "",
    zone_name: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [zonesDisabled, setZonesDisabled] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get("https://my.ispl-t10.com/api/state");
      let states = response.data.data.states || [];
      const uniqueStates = Array.from(
        new Set(states.map((state: any) => state.state_name))
      ).map((state_name) => {
        return states.find((state: any) => state.state_name === state_name);
      });

      setStates(uniqueStates);
    } catch (error) {
      console.error("Error fetching states:", error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch states. Please try again later.",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setFormData({
      first_name: "",
      surname: "",
      mobile_number: "",
      date_of_birth: "",
      email: "",
      state_name: "",
      cities_states_id: "",
      zone_name: "",
      password: "",
      password_confirmation: "",
    });
    setErrors({});
    setCities([]);
    setZones([]);
    setZonesDisabled(true);

    await fetchStates();
    setRefreshing(false);
  };

  const fetchCitiesByState = async (stateName: string) => {
    try {
      const response = await axios.get(
        `https://my.ispl-t10.com/api/get_city_base_on_state?state_name=${stateName}`
      );
      const cities = response.data.cities || [];
      setCities(cities);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cities_states_id: "",
        zone_name: "",
      }));
      setZones([]);
      setZonesDisabled(true);
    } catch (error) {
      console.error(`Error fetching cities for ${stateName}:`, error);
      Toast.show({
        type: "error",
        text1: `Failed to fetch cities for ${stateName}. Please try again later.`,
      });
    }
  };

  const fetchZonesByCity = async (cityId: string) => {
    try {
      const response = await axios.get(
        `https://my.ispl-t10.com/api/get_zone_base_on_city?cities_states_id=${cityId}`
      );
      const zones = response.data.zone || [];
      setZones(zones);
      if (zones.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          zone_name: zones[0].zone_name,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          zone_name: "",
        }));
        Toast.show({
          type: "info",
          text1: "No zones available for the selected city.",
        });
      }
    } catch (error) {
      console.error(`Error fetching zones for city ID ${cityId}:`, error);
      Toast.show({
        type: "error",
        text1: `Failed to fetch zones. Please try again later.`,
      });
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "first_name":
      case "surname":
        if (!/^[A-Za-z]+$/.test(value)) {
          error = "This field should contain only alphabetic characters.";
        }
        break;
      case "mobile_number":
        if (!/^\d+$/.test(value)) {
          error = "Please enter only numeric characters.";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address.";
        } else {
          const domainPattern = /\.[a-zA-Z]{2,}$/;
          if (!domainPattern.test(value)) {
            error = "Please enter a valid email address with a domain.";
          }
        }
        break;
      case "password":
      case "password_confirmation":
        if (value.length < 4) {
          error = "Password should be at least 4 characters long.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors: any) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    let sanitizedValue = value;
    if (name === "first_name" || name === "surname") {
      sanitizedValue = value.replace(/[^A-Za-z]/gi, "");
    } else if (name === "mobile_number") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: sanitizedValue,
    }));

    validateField(name, sanitizedValue);

    if (name === "state_name") {
      fetchCitiesByState(sanitizedValue);
    } else if (name === "cities_states_id") {
      fetchZonesByCity(sanitizedValue);
    }
  };

  const handleSubmit = async () => {
    let formValid = true;
    const newErrors: any = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "zone_name" && !formData[key]) {
        newErrors[key] = "This field is required.";
        formValid = false;
      }
    });

    if (formData.mobile_number.length !== 10) {
      newErrors.mobile_number = "Mobile number should be exactly 10 digits.";
      formValid = false;
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
      formValid = false;
    }

    if (
      !/\S+@\S+\.\S+/.test(formData.email) ||
      !/\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address with a domain.";
      formValid = false;
    }

    setErrors(newErrors);

    if (!formValid) {
      Toast.show({
        type: "error",
        text1: "Please correct the errors in the form.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://my.ispl-t10.com/api/register",
        formData
      );

      if (response.data.remark === "validation_error") {
        const serverErrors = response.data.message.error;
        if (Array.isArray(serverErrors)) {
          serverErrors.forEach((errMsg: string) => {
            Toast.show({ type: "error", text1: errMsg });
          });
        } else {
          Toast.show({ type: "error", text1: "An unexpected error occurred." });
        }
        return;
      }

      const payRequestId = response.data.data.pay_request_id;

      setFormData({
        first_name: "",
        surname: "",
        mobile_number: "",
        date_of_birth: "",
        email: "",
        state_name: "",
        cities_states_id: "",
        zone_name: "",
        password: "",
        password_confirmation: "",
      });

      setErrors({});
      setZonesDisabled(true);

      Toast.show({ type: "success", text1: "Registration successful!" });

      const paymentRequestResponse = await axios.post(
        `https://my.ispl-t10.com/api/payment-request/${payRequestId}`
      );

      if (paymentRequestResponse.data.status === "Successful") {
        const { encrypted_data, access_code } = paymentRequestResponse.data;

        const paymentUrl =
          "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
        const paymentParams = new URLSearchParams();
        paymentParams.append("encRequest", encrypted_data);
        paymentParams.append("access_code", access_code);

        // Open the browser for payment
        const fullPaymentUrl = `${paymentUrl}&${paymentParams.toString()}`;
        Linking.openURL(fullPaymentUrl).catch((err) => {
          console.error("Error opening payment URL:", err);
          Toast.show({
            type: "error",
            text1: "Unable to open payment page. Please try again later.",
          });
        });

        // Listen for the redirect back to the app
        const handleDeepLink = (event: { url: string }) => {
          const { url } = event;
          if (url.includes("payment_response")) {
            const paymentStatus = new URL(url).searchParams.get("status");

            if (paymentStatus === "Successful") {
              navigation.dispatch(
                CommonActions.navigate({
                  name: "login",
                })
              );
            } else {
              Toast.show({
                type: "error",
                text1: "Payment was unsuccessful. Please try again.",
              });
            }
          }
        };

        // Add listener for deep link
        const subscription = Linking.addEventListener("url", handleDeepLink);

        // Clean up listener after the component is unmounted
        return () => {
          subscription.remove();
        };
      } else {
        Toast.show({
          type: "error",
          text1: "Payment was unsuccessful. Please try again.",
        });
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.remark === "validation_error"
      ) {
        const serverErrors = error.response.data.message.error;
        if (Array.isArray(serverErrors)) {
          serverErrors.forEach((errMsg: string) => {
            Toast.show({ type: "error", text1: errMsg });
          });
        } else {
          Toast.show({ type: "error", text1: "An unexpected error occurred." });
        }
      } else {
        console.error("Error during registration:", error);
        Toast.show({
          type: "error",
          text1: "An error occurred. Please try again later.",
        });
      }
    }
  };
  return (
    <ImageBackground source={require("../../assets/images/latestBg.webp")}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Text style={styles.title}>Registration Here</Text>
          <Text style={styles.label}>First Name*</Text>
          <TextInput
            value={formData.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
            style={styles.input}
          />
          {errors.first_name && (
            <Text style={styles.error}>{errors.first_name}</Text>
          )}
          <Text style={styles.label}>Surname*</Text>
          <TextInput
            value={formData.surname}
            onChangeText={(text) => handleChange("surname", text)}
            style={styles.input}
          />
          {errors.surname && <Text style={styles.error}>{errors.surname}</Text>}
          <Text style={styles.label}>Mobile Number*</Text>
          <TextInput
            value={formData.mobile_number}
            onChangeText={(text) => handleChange("mobile_number", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          {errors.mobile_number && (
            <Text style={styles.error}>{errors.mobile_number}</Text>
          )}
          <Text style={styles.label}>Date of Birth*</Text>
          <TextInput
            value={formData.date_of_birth}
            onChangeText={(text) => handleChange("date_of_birth", text)}
            style={styles.input}
          />
          <Text style={styles.label}>Email*</Text>
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <Text style={styles.label}>Select State*</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.state_name}
              onValueChange={(value) => handleChange("state_name", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {states.map((state) => (
                <Picker.Item
                  key={state.id}
                  label={state.state_name}
                  value={state.state_name}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Select City*</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.cities_states_id}
              onValueChange={(value) => handleChange("cities_states_id", value)}
              style={styles.picker}
              enabled={formData.state_name !== ""}
            >
              <Picker.Item label="Select City" value="" />
              {cities.map((city) => (
                <Picker.Item
                  key={city.id}
                  label={city.city_name}
                  value={city.city_name}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Zone</Text>
          <TextInput
            style={styles.input}
            value={formData.zone_name}
            editable={false}
          />
          {errors.zone_name && (
            <Text style={styles.error}>{errors.zone_name}</Text>
          )}
          <Text style={styles.label}>Password*</Text>
          <TextInput
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            style={styles.input}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
          <Text style={styles.label}>Confirm Password*</Text>
          <TextInput
            value={formData.password_confirmation}
            onChangeText={(text) => handleChange("password_confirmation", text)}
            secureTextEntry
            style={styles.input}
          />
          {errors.password_confirmation && (
            <Text style={styles.error}>{errors.password_confirmation}</Text>
          )}
          <Pressable onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.buttonText}>Register & Pay</Text>
          </Pressable>
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 0,
    padding: 10,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  input: {
    height: 55,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "#fbe29a",
    fontSize: 18,
  },
  pickerWrapper: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 12,
    fontSize: 12,
  },
  linkText: {
    color: "#fbe29a",
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "700",
  },
  timerText: {
    textAlign: "center",
    marginBottom: 16,
  },
  submitBtn: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 55,
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    width: "auto",
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default RegistrationForm;
