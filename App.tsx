import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ChatbotProvider } from './src/context/ChatbotContext';
import { ClubBookingProvider } from './src/context/ClubBookingContext';
import { ConversationsProvider } from './src/context/ConversationsContext';
import { LocationProvider } from './src/context/LocationContext';
import { SessionsProvider } from './src/context/SessionsContext';
import { ToastProvider } from './src/context/ToastContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <LocationProvider>
              <ChatbotProvider>
                <ClubBookingProvider>
                  <ConversationsProvider>
                    <SessionsProvider>
                      <StatusBar style="light" />
                      <AppNavigator />
                    </SessionsProvider>
                  </ConversationsProvider>
                </ClubBookingProvider>
              </ChatbotProvider>
            </LocationProvider>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
