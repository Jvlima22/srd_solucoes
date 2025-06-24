import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../@types/routes";

type Props = NativeStackScreenProps<RootStackParamList, "SplashScreen">;

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("StartupScreen");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00123D" />
      </View>
      <Image
        source={require("../assets/Background.png")}
        style={styles.footerBackground}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 324,
    height: 324,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: windowWidth,
    height: windowHeight * 0.3,
    resizeMode: "cover",
  },
});
