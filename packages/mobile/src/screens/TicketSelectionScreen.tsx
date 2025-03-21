import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovieStore } from '../store/movieStore';

type TicketSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TicketSelection'>;
  route: RouteProp<RootStackParamList, 'TicketSelection'>;
};

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

const ticketTypes: TicketType[] = [
  {
    id: 'adult',
    name: 'Adult',
    price: 14.99,
    description: 'Ages 13 and up',
  },
  {
    id: 'child',
    name: 'Child',
    price: 9.99,
    description: 'Ages 3-12',
  },
  {
    id: 'senior',
    name: 'Senior',
    price: 11.99,
    description: 'Ages 65 and up',
  },
  {
    id: 'student',
    name: 'Student',
    price: 12.99,
    description: 'Valid student ID required',
  },
];

export default function TicketSelectionScreen({ navigation, route }: TicketSelectionScreenProps) {
  const { showtimeId, selectedSeats } = route.params;
  const { getShowtimeById, setTickets } = useMovieStore();
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ticketTypes.map((type) => [type.id, 0]))
  );

  const showtime = getShowtimeById(showtimeId);

  useEffect(() => {
    if (showtime) {
      navigation.setOptions({
        title: 'Select Tickets',
      });
    }
  }, [showtime, navigation]);

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = ticketTypes.reduce(
    (sum, type) => sum + type.price * quantities[type.id],
    0
  );

  const handleQuantityChange = (ticketId: string, change: number) => {
    const newQuantity = Math.max(0, quantities[ticketId] + change);
    const newTotalTickets = totalTickets + (newQuantity - quantities[ticketId]);

    if (newTotalTickets > selectedSeats.length) return;

    setQuantities((prev) => ({
      ...prev,
      [ticketId]: newQuantity,
    }));
  };

  const handleContinue = async () => {
    if (totalTickets !== selectedSeats.length) return;

    setLoading(true);
    try {
      // In a real app, this would validate ticket availability with the backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTickets(quantities);
      navigation.navigate('Payment', {
        showtimeId,
        selectedSeats,
        ticketQuantities: quantities,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showtime) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Showtime not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.seatsText}>
        {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
      </Text>

      <FlatList
        data={ticketTypes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketName}>{item.name}</Text>
              <Text style={styles.ticketDescription}>{item.description}</Text>
              <Text style={styles.ticketPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, quantities[item.id] === 0 && styles.disabledButton]}
                onPress={() => handleQuantityChange(item.id, -1)}
                disabled={quantities[item.id] === 0}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantities[item.id]}</Text>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  totalTickets === selectedSeats.length && styles.disabledButton,
                ]}
                onPress={() => handleQuantityChange(item.id, 1)}
                disabled={totalTickets === selectedSeats.length}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.ticketList}
      />

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (totalTickets !== selectedSeats.length || loading) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={totalTickets !== selectedSeats.length || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  seatsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ticketList: {
    flex: 1,
    padding: 16,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ticketPrice: {
    fontSize: 16,
    color: '#007AFF',
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
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff3b30',
    marginTop: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 