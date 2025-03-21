import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovieStore } from '../store/movieStore';
import { Ionicons } from '@expo/vector-icons';

type OrderConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OrderConfirmation'>;
  route: RouteProp<RootStackParamList, 'OrderConfirmation'>;
};

export default function OrderConfirmationScreen({
  navigation,
  route,
}: OrderConfirmationScreenProps) {
  const { orderId } = route.params;
  const { clearBooking } = useMovieStore();

  useEffect(() => {
    navigation.setOptions({
      title: 'Order Confirmation',
      headerLeft: () => null, // Disable back button
    });
  }, [navigation]);

  const handleDone = () => {
    clearBooking();
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.subtitle}>Your tickets have been booked successfully</Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order ID:</Text>
          <Text style={styles.orderId}>{orderId}</Text>
          <Text style={styles.orderDate}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.qrPlaceholder}>QR Code Placeholder</Text>
          <Text style={styles.qrNote}>
            Please show this code at the theater entrance
          </Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Important Information:</Text>
          <Text style={styles.instructionText}>
            • Please arrive at least 15 minutes before showtime
          </Text>
          <Text style={styles.instructionText}>
            • Present this code at the theater entrance
          </Text>
          <Text style={styles.instructionText}>
            • Your tickets will be sent to your registered email
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 32,
    alignItems: 'center',
  },
  qrPlaceholder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  qrNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  instructions: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
}); 