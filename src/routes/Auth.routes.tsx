import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignInScreen } from '@screens/Auth/signInScreen'
import { StartupScreen } from '@screens/Auth/startupScreen'

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>()
export function AuthRoutes() {
  return (
    <Navigator>
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
  )
}
