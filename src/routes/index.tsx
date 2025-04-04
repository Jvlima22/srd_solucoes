import { NavigationContainer } from '@react-navigation/native'
import { AuthRoutes } from './Auth.routes'
import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './App.routes'

export function Routes() {
  const { user } = useAuth()
  return (
    <NavigationContainer>
      {user?.token ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  )
}
