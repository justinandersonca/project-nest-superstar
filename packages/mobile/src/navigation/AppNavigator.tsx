import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import MainTabs from './MainTabs';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import ShowtimesScreen from '../screens/ShowtimesScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import TicketSelectionScreen from '../screens/TicketSelectionScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import FoodAndDrinksScreen from '../screens/FoodAndDrinksScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import TheaterDetailsScreen from '../screens/TheaterDetailsScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={navigation.goBack}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : null,
        headerRight: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity 
              onPress={() => {
                navigation.popToTop();
                navigation.navigate('MainTabs');
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : null,
      })}
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
        options={{ title: 'Select Time' }}
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
  );
} 