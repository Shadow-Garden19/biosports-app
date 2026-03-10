import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext';
import { useSessions } from '../context/SessionsContext';
import { useConversations } from '../context/ConversationsContext';
import { mockAccessoires } from '../data/mockData';
import { SPORTS_LABELS } from '../types';
import { ChatbotAssistant } from '../components/ChatbotAssistant';
import {
  OnboardingScreen,
  WelcomeScreen,
  RegisterScreen,
  HomeScreen,
  ProfileScreen,
  SearchScreen,
  ChatListScreen,
  ChatScreen,
  SessionDetailScreen,
  VenuesScreen,
  BookingScreen,
  BoutiqueScreen,
  AchatScreen,
  CreateSessionScreen,
} from '../screens';

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Main: undefined;
  SessionDetail: { sessionId: string };
  CreateSession: undefined;
  Chat: { conversationId: string };
  Booking: { lieuId: string; sessionId?: string };
  Achat: { productId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Venues: undefined;
  Boutique: undefined;
  ChatList: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#C9A227',
          tabBarInactiveTintColor: '#808080',
          tabBarStyle: { paddingBottom: 4, height: 56, backgroundColor: '#1A1A1A', borderTopColor: '#333' },
        }}
      >
        <Tab.Screen
          name="Home"
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Search"
        options={{
          tabBarLabel: 'Recherche',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
        component={SearchScreen}
      />
      <Tab.Screen
        name="Venues"
        options={{
          tabBarLabel: 'Lieux',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} size={size} color={color} />
          ),
        }}
        component={VenuesScreen}
      />
      <Tab.Screen
        name="Boutique"
        options={{
          tabBarLabel: 'Boutique',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'bag' : 'bag-outline'} size={size} color={color} />
          ),
        }}
        component={BoutiqueScreen}
      />
      <Tab.Screen
        name="ChatList"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={size} color={color} />
          ),
        }}
        component={ChatListScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      </Tab.Navigator>
      <ChatbotAssistant />
    </>
  );
}

export function AppNavigator() {
  const { isAuthenticated, login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showOnboarding ? (
            <Stack.Screen name="Onboarding">
              {() => (
                <OnboardingScreen
                  onFinish={() => setShowOnboarding(false)}
                />
              )}
            </Stack.Screen>
          ) : showRegister ? (
            <Stack.Screen name="Register">
              {() => (
                <RegisterScreen
                  onGoToLogin={() => setShowRegister(false)}
                  onRegister={(data) => {
                    login(data.email, data.password);
                    setShowRegister(false);
                  }}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth">
              {() => (
                <WelcomeScreen
                  onLogin={login}
                  onGoToRegister={() => setShowRegister(true)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="SessionDetail"
          options={{ presentation: 'modal' }}
          component={SessionDetailWrapper}
        />
        <Stack.Screen
          name="CreateSession"
          options={{ presentation: 'modal' }}
          component={CreateSessionWrapper}
        />
        <Stack.Screen
          name="Chat"
          options={{ presentation: 'modal' }}
          component={ChatWrapper}
        />
        <Stack.Screen
          name="Booking"
          options={{ presentation: 'modal' }}
          component={BookingWrapper}
        />
        <Stack.Screen
          name="Achat"
          options={{ presentation: 'modal' }}
          component={AchatWrapper}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function SessionDetailWrapper({ route, navigation }: any) {
  const { sessionId } = route.params;
  const currentUserId = useAuth().user?.id;
  const { sessions } = useSessions();
  const { conversations } = useConversations();
  const session = sessions.find((s) => s.id === sessionId);
  const findChatWith = (userId: string) => {
    const c = conversations.find(
      (conv) =>
        conv.participants.length === 2 &&
        conv.participants.includes(currentUserId ?? '') &&
        conv.participants.includes(userId)
    );
    return c?.id;
  };
  return (
    <SessionDetailScreen
      sessionId={sessionId}
      onBack={() => navigation.goBack()}
      onBookVenue={(sid, lid) =>
        navigation.navigate('Booking', { lieuId: lid, sessionId: sid })
      }
      onChat={(userId) => {
        const conversationId = findChatWith(userId);
        if (conversationId) navigation.navigate('Chat', { conversationId });
      }}
      onOpenGroupChat={(conversationId) =>
        navigation.navigate('Chat', { conversationId })
      }
      onDeleteSession={() => navigation.goBack()}
    />
  );
}

function ChatWrapper({ route, navigation }: any) {
  const { conversationId } = route.params;
  return (
    <ChatScreen
      conversationId={conversationId}
      onBack={() => navigation.goBack()}
    />
  );
}

function BookingWrapper({ route, navigation }: any) {
  const { lieuId, sessionId } = route.params || {};
  const { triggerAfterReservation } = useChatbot();
  const { sessions } = useSessions();
  const session = sessionId ? sessions.find((s) => s.id === sessionId) : null;

  return (
    <BookingScreen
      lieuId={lieuId}
      sessionId={sessionId}
      onBack={() => navigation.goBack()}
      onConfirm={(conversationId) => {
        if (session) {
          triggerAfterReservation(session.id, session.sportId, SPORTS_LABELS[session.sportId]);
        }
        navigation.goBack();
        if (conversationId) {
          navigation.navigate('Chat', { conversationId });
        }
      }}
    />
  );
}

function CreateSessionWrapper({ navigation }: any) {
  return (
    <CreateSessionScreen onBack={() => navigation.goBack()} />
  );
}

function AchatWrapper({ route, navigation }: any) {
  const { productId } = route.params || {};
  const product = mockAccessoires.find((a: { id: string }) => a.id === productId) || null;
  return (
    <AchatScreen
      product={product}
      onBack={() => navigation.goBack()}
      onSuccess={() => navigation.goBack()}
    />
  );
}
