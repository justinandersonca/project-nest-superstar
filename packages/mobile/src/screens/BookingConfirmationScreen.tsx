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
import { useShowtime } from '../services/api/useApi';
import { colors } from '../theme';

type BookingConfirmationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookingConfirmation'>;
  route: RouteProp<RootStackParamList, 'BookingConfirmation'>;
};

export default function BookingConfirmationScreen({ navigation, route }: BookingConfirmationScreenProps) {
  const { showtimeId, selectedSeats, ticketTypes } = route.params;
  const { data: showtime, isLoading, error } = useShowtime(showtimeId);
  const [loading, setLoading] = useState(false);

  const prices = {
    adult: showtime?.price || 0,
    child: (showtime?.price || 0) * 0.7,
    senior: (showtime?.price || 0) * 0.8,
  };

  const calculateTotal = () => {
    return Object.entries(ticketTypes).reduce(
      (total, [type, count]) => total + count * prices[type as keyof typeof prices],
      0
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // In a real app, this would create the booking in the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigation.navigate('MainTabs');
    } catch (error) {
      alert('Failed to confirm booking. Please try again.');
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
        <Text style={styles.errorText}>Error loading booking details. Please try again later.</Text>
      </View>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Showtime</Text>
            <Text style={styles.summaryValue}>
              {new Date(showtime.startTime).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Seats</Text>
            <Text style={styles.summaryValue}>{selectedSeats.join(', ')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tickets</Text>
          {Object.entries(ticketTypes).map(([type, count]) => (
            count > 0 && (
              <View key={type} style={styles.ticketRow}>
                <Text style={styles.ticketType}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} x {count}
                </Text>
                <Text style={styles.ticketPrice}>
                  ${(count * prices[type as keyof typeof prices]).toFixed(2)}
                </Text>
              </View>
            )
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Amount to Pay</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={loading}
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketType: {
    fontSize: 16,
    color: colors.text,
  },
  ticketPrice: {
    fontSize: 16,
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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