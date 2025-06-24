import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen } from "@screens/Auth/signInScreen";
import { StartupScreen } from "@screens/Auth/startupScreen";
import { SplashScreen } from "@screens/splashScreen";
import type { RootStackParamList } from "../@types/routes";

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();
export function AuthRoutes() {
  return (
    <Navigator initialRouteName="SplashScreen">
      <Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="StartupScreen"
        component={StartupScreen}
        options={{ headerShown: false }}
      />

      <Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
}
