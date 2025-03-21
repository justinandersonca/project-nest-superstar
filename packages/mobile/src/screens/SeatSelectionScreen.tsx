import React, { useEffect, useState } from 'react';
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
import { Showtime } from '../types/data';

type SeatSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SeatSelection'>;
  route: RouteProp<RootStackParamList, 'SeatSelection'>;
};

interface Seat {
  id: string;
  row: number;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
}

export default function SeatSelectionScreen({ navigation, route }: SeatSelectionScreenProps) {
  const { showtimeId } = route.params;
  const { getShowtimeById, setSelectedShowtime, setSelectedSeats: setStoreSelectedSeats } = useMovieStore();
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setLocalSelectedSeats] = useState<Seat[]>([]);

  const showtime = getShowtimeById(showtimeId);

  useEffect(() => {
    if (showtime) {
      setSelectedShowtime(showtime);
      // Generate mock seat data
      const mockSeats: Seat[] = [];
      for (let row = 1; row <= 8; row++) {
        for (let number = 1; number <= 10; number++) {
          const isAvailable = Math.random() > 0.3; // 70% chance of being available
          mockSeats.push({
            id: `${row}-${number}`,
            row,
            number,
            isAvailable,
            isSelected: false,
          });
        }
      }
      setSeats(mockSeats);
    }
  }, [showtime, setSelectedShowtime]);

  const handleSeatPress = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.id === seat.id ? { ...s, isSelected: !s.isSelected } : s
      )
    );

    setLocalSelectedSeats((prev: Seat[]) => {
      if (seat.isSelected) {
        return prev.filter((s: Seat) => s.id !== seat.id);
      } else {
        return [...prev, { ...seat, isSelected: true }];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;

    setLoading(true);
    try {
      // In a real app, this would validate seat availability with the backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      const seatIds = selectedSeats.map((seat) => seat.id);
      setStoreSelectedSeats(seatIds);
      navigation.navigate('TicketSelection', {
        showtimeId,
        selectedSeats: seatIds,
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

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      <ScrollView style={styles.seatsContainer}>
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <Text style={styles.rowLabel}>{String.fromCharCode(65 + rowIndex)}</Text>
            <View style={styles.seats}>
              {seats
                .filter((seat) => seat.row === rowIndex + 1)
                .map((seat) => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seat,
                      !seat.isAvailable && styles.unavailableSeat,
                      seat.isSelected && styles.selectedSeat,
                    ]}
                    onPress={() => handleSeatPress(seat)}
                    disabled={!seat.isAvailable}
                  >
                    <Text
                      style={[
                        styles.seatNumber,
                        !seat.isAvailable && styles.unavailableSeatText,
                        seat.isSelected && styles.selectedSeatText,
                      ]}
                    >
                      {seat.number}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.availableSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.selectedSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.unavailableSeat]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedSeats.length === 0 || loading) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0 || loading}
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
  screen: {
    height: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  screenText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  seatsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowLabel: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableSeat: {
    backgroundColor: '#ccc',
  },
  selectedSeat: {
    backgroundColor: '#007AFF',
  },
  seatNumber: {
    fontSize: 12,
    color: '#666',
  },
  unavailableSeatText: {
    color: '#999',
  },
  selectedSeatText: {
    color: '#fff',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 4,
  },
  availableSeat: {
    backgroundColor: '#e0e0e0',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
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
  disabledButton: {
    backgroundColor: '#ccc',
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