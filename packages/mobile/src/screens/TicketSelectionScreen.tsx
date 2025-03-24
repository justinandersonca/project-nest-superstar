import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovieStore } from '../store/movieStore';
import { useShowtime } from '../services/api/useApi';
import { colors } from '../theme';

type TicketSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TicketSelection'>;
  route: RouteProp<RootStackParamList, 'TicketSelection'>;
};

export default function TicketSelectionScreen({ navigation, route }: TicketSelectionScreenProps) {
  const { showtimeId, selectedSeats } = route.params;
  const { data: showtime, isLoading, error } = useShowtime(showtimeId);
  const [loading, setLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<{ [key: string]: number }>({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const prices = {
    adult: showtime?.price || 0,
    child: (showtime?.price || 0) * 0.7,
    senior: (showtime?.price || 0) * 0.8,
  };

  const handleIncrement = (type: string) => {
    setTicketTypes((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const handleDecrement = (type: string) => {
    setTicketTypes((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const calculateTotal = () => {
    return Object.entries(ticketTypes).reduce(
      (total, [type, count]) => total + count * prices[type as keyof typeof prices],
      0
    );
  };

  const handleConfirm = async () => {
    const totalTickets = Object.values(ticketTypes).reduce((sum, count) => sum + count, 0);
    if (totalTickets !== selectedSeats.length) {
      alert('Please select the correct number of tickets for your seats');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would create a booking with the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigation.navigate('BookingConfirmation', {
        showtimeId,
        selectedSeats,
        ticketTypes,
      });
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !showtime) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading showtime. Please try again later.</Text>
      </View>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Ticket Types</Text>
          {Object.entries(ticketTypes).map(([type, count]) => (
            <View key={type} style={styles.ticketRow}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketType}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                <Text style={styles.ticketPrice}>${prices[type as keyof typeof prices].toFixed(2)}</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecrement(type)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{count}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleIncrement(type)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Seats</Text>
          <Text style={styles.seatsText}>{selectedSeats.join(', ')}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (loading || totalPrice === 0) && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={loading || totalPrice === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketType: {
    fontSize: 16,
    color: colors.text,
  },
  ticketPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
    color: colors.text,
  },
  seatsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.error,
    marginTop: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 