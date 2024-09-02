import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [error, setError] = useState<{
    email: string;
    password: string;
    otp: string;
    general: string;
  }>({
    email: "",
    password: "",
    otp: "",
    general: "",
  });
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showVerifyModal, setVerifyModal] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResendButton(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile: string): boolean => {
    const re = /^[0-9]{10}$/;
    return re.test(String(mobile));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    if (!validateEmail(email)) {
      setLoading(false);
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address",
      }));
      return;
    }

    try {
      const response = await axios.post(
        "https://my.ispl-t10.com/api/post-login",
        { email, password }
      );

      if (response.status === 200) {
        const token = response.data.data.token;
        await AsyncStorage.setItem("apiToken", token);

        const tokenFromStorage = await AsyncStorage.getItem("apiToken");

        Toast.show({
          type: "success",
          text1: "Login successful",
        });

        const { completed_status } = response.data.data.user;
        const form_city_edit = response.data.form_city_edit;

        let redirectPath = "dashboard-session-2";

        if (completed_status === 1 && !form_city_edit) {
          redirectPath = "dashboard-golden-page";
        }

        navigation.navigate(redirectPath);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 401) {
          Toast.show({
            type: "error",
            text1: "Session expired. Please login again.",
          });
          await AsyncStorage.removeItem("apiToken");
          navigation.dispatch(
            CommonActions.navigate({
              name: "login",
            })
          );
        } else if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.pay_request_id
        ) {
          handlePaymentFailure(err.response.data.pay_request_id);
        } else {
          const errorMessage =
            err.response?.data?.error_message ||
            "Incorrect Details Please Try Again !!!";
          setError((prevError) => ({
            ...prevError,
            email: "Invalid email or password",
            password: "Invalid email or password",
          }));
          Toast.show({
            type: "error",
            text1: errorMessage,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email) && !validateMobile(email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address or mobile number",
      }));
      return;
    }

    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    try {
      const response = await axios.post(
        "https://my.ispl-t10.com/api/send-otp",
        { email }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });
        setShowOTP(true);
        setTimer(120);
        setShowResendButton(false); // Hide resend button when OTP is sent
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to send OTP. Please try again.",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError({ email: "", password: "", otp: "", general: "" });

    try {
      const response = await axios.post(
        "https://my.ispl-t10.com/api/verify-otp",
        { otp, email }
      );

      if (response.data.status) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });

        const token = response.data.data.token;
        await AsyncStorage.setItem("apiToken", token);

        const tokenFromStorage = await AsyncStorage.getItem("apiToken");

        try {
          const response = await axios.get(
            "https://my.ispl-t10.com/api/user-dashboard-api",
            {
              headers: {
                Authorization: `Bearer ${tokenFromStorage}`,
              },
            }
          );

          const userData = response.data.users;
          const is_city_updated = response.data.users.is_city_updated;
          const { completed_status, form_city_edit } = response.data;
          const is_email_verify = response.data.users.is_email_verify;
          const is_mobile_verify = response.data.users.is_mobile_verify;

          if (completed_status === 1 && form_city_edit) {
            setShowModal(true);
          }
          if (is_email_verify === 0 && is_mobile_verify === 0) {
            setVerifyModal(true);
          }
          if (
            (is_city_updated === 1 && completed_status === 1) ||
            (response.data.personal_info_status === "created" &&
              response.data.playing_details_status === "created") ||
            (response.data.personal_info_status === "updated" &&
              response.data.playing_details_status === "updated")
          ) {
            navigation.dispatch(
              CommonActions.navigate({
                name: "dashboard-golden-page",
              })
            );
          } else {
            navigation.dispatch(
              CommonActions.navigate({
                name: "dashboard-session-2",
              })
            );
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error fetching user data",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to verify OTP. Please try again.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message.failed
        ) {
          Toast.show({
            type: "error",
            text1: err.response.data.message.failed[0],
          });
          handlePaymentFailure(err.response.data.pay_request_id);
        } else {
          Toast.show({
            type: "error",
            text1: "An error occurred. Please try again.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = async (payRequestId: string) => {
    try {
      const token = await AsyncStorage.getItem("apiToken");
      if (token) {
        const paymentRequestResponse = await axios.get(
          `https://my.ispl-t10.com/api/payment-request/${payRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (paymentRequestResponse.data.status === "Successful") {
          const { encrypted_data, access_code } = paymentRequestResponse.data;

          const url = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encrypted_data}&access_code=${access_code}`;

          Linking.openURL(url).catch((err) => {
            console.error("Failed to open URL:", err);
            Toast.show({
              type: "error",
              text1: "Failed to open payment page. Please try again.",
            });
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Payment failed. Please try again.",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred during payment processing.",
      });
    }
  };

  const handleClosePaymentGateway = () => {
    setShowPaymentGateway(false);
    setPaymentUrl("");
  };

  const handleOTPResend = async () => {
    setTimer(120);
    setShowResendButton(false);
    await handleSendOTP();
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/images/latestBg.webp")}
        style={styles.container}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Login Here</Text>
          <Text style={styles.label}>Email Address or Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {error.email ? <Text style={styles.error}>{error.email}</Text> : null}

          {showOTP ? (
            <>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={(text) => setOtp(text)}
              />
              {error.otp ? <Text style={styles.error}>{error.otp}</Text> : null}
              <TouchableOpacity onPress={() => setShowOTP(false)}>
                <Text style={styles.linkText}>Login with password</Text>
              </TouchableOpacity>
              <View style={styles.timerContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    OTP expires in {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </Text>
                ) : (
                  showResendButton && (
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleOTPResend}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Resending OTP..." : "Resend OTP"}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleSendOTP}>
                <Text style={styles.linkText}>Login with OTP</Text>
              </TouchableOpacity>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {error.password ? <Text style={styles.error}>{error.password}</Text> : null}
              <TouchableOpacity
                style={styles.sqrBtn}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  Login
                </Text>
              </TouchableOpacity>
            </>
          )}
          <Toast />
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
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
  error: {
    color: "red",
    marginBottom: 12,
  },
  linkText: {
    color: "#fbe29a",
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "700",
    fontSize: 16,
  },
  timerContainer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  timerText: {
    textAlign: "center",
    marginBottom: 16,
  },
  resendButton: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 49,
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "auto",
  },
  buttonText: {
    color: "#fbe29a",
    fontSize: 16,
    fontWeight: "600",
  },
  sqrBtn: {
    alignItems: "center",
    borderColor: "#fbe29a",
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 30,
    height: 49,
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    width: "auto",
  },
});

export default LoginForm;
