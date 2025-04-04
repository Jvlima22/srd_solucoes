import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native'
import { AlignJustify } from 'lucide-react-native'

import { ManifestScreen } from '@screens/App/manifestScreen'
import { CollectionScreen } from '@screens/App/collectionScreen'
import { DeliveryScreen } from '@screens/App/deliveryScreen'
import { DispatchScreen } from '@screens/App/dispatchScreen'
import { TransferScreen } from '@screens/App/transferScreen'
import { WithDrawalScreen } from '@screens/App/withDrawalScreen'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@hooks/useAuth'

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>()

export function AppRoutes() {
  const navigation = useNavigation()
  const { signOut } = useAuth()
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const navigateTo = (screen: keyof RootStackParamList) => {
    setMenuVisible(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigation.navigate(screen)
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <>
      <Navigator
        initialRouteName="AppScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#27408B',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerLeft: ({ tintColor, href }) => (
            <Pressable onPress={toggleMenu}>
              <AlignJustify size={35} color={tintColor} />
            </Pressable>
          ),
          headerTintColor: '#fff',
        }}
      >
        <Screen
          name="AppScreen"
          component={ManifestScreen}
          options={{
            headerTitle: 'Manifesto',
          }}
        />
        <Screen
          name="CollectionScreen"
          component={CollectionScreen}
          options={{
            headerTitle: 'Coleta',
          }}
        />
        <Screen
          name="DeliveryScreen"
          component={DeliveryScreen}
          options={{
            headerTitle: 'Entrega',
          }}
        />
        <Screen
          name="DispatchScreen"
          component={DispatchScreen}
          options={{
            headerTitle: 'Despacho',
          }}
        />
        <Screen
          name="TransferScreen"
          component={TransferScreen}
          options={{
            headerTitle: 'Transferência',
          }}
        />
        <Screen
          name="WithDrawalScreen"
          component={WithDrawalScreen}
          options={{
            headerTitle: 'Retirada',
          }}
        />
      </Navigator>

      {/* Menu suspenso */}
      {menuVisible && (
        <View style={styles.menu}>
          <Pressable
            onPress={() => navigateTo('AppScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Manifesto</Text>
          </Pressable>
          <Pressable
            onPress={() => navigateTo('DeliveryScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Entrega</Text>
          </Pressable>
          <Pressable
            onPress={() => navigateTo('CollectionScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Coleta</Text>
          </Pressable>
          <Pressable
            onPress={() => navigateTo('DispatchScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Despacho</Text>
          </Pressable>
          <Pressable
            onPress={() => navigateTo('WithDrawalScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Retirada</Text>
          </Pressable>
          <Pressable
            onPress={() => navigateTo('TransferScreen')}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Transferência</Text>
          </Pressable>
          <Pressable onPress={handleSignOut} style={styles.menuItem}>
            <Text style={styles.menuText}>Sair</Text>
          </Pressable>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70, // Adjust for header height
    left: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    right: 0,
    backgroundColor: '#27408B',
    zIndex: 10,
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
})
