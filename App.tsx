import './src/styles/global.css'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Routes } from '@routes/index'
import { AuthProvider } from '@contexts/AuthContext'

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
