import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from './types';
import { colors } from '../theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TheatersScreen from '../screens/TheatersScreen';
import TicketsScreen from '../screens/TicketsScreen';
import AccountScreen from '../screens/AccountScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import ShowtimesScreen from '../screens/ShowtimesScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import TicketSelectionScreen from '../screens/TicketSelectionScreen';
import FoodAndDrinksScreen from '../screens/FoodAndDrinksScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import TheaterDetailsScreen from '../screens/TheaterDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Theaters"
        component={TheatersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          console.log('New navigation state:', state);
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MovieDetails" 
          component={MovieDetailsScreen}
          options={{ title: 'Movie Details' }}
        />
        <Stack.Screen 
          name="Showtimes" 
          component={ShowtimesScreen}
          options={{ title: 'Showtimes' }}
        />
        <Stack.Screen 
          name="TheaterDetails" 
          component={TheaterDetailsScreen}
          options={{ title: 'Theater Details' }}
        />
        <Stack.Screen 
          name="SeatSelection" 
          component={SeatSelectionScreen}
          options={{ title: 'Select Seats' }}
        />
        <Stack.Screen 
          name="TicketSelection" 
          component={TicketSelectionScreen}
          options={{ title: 'Select Tickets' }}
        />
        <Stack.Screen 
          name="FoodAndDrinks" 
          component={FoodAndDrinksScreen}
          options={{ title: 'Food & Drinks' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{ title: 'Order Confirmation' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 