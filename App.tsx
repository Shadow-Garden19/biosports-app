import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ChatbotProvider } from './src/context/ChatbotContext';
import { SessionsProvider } from './src/context/SessionsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatbotProvider>
          <SessionsProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </SessionsProvider>
        </ChatbotProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
