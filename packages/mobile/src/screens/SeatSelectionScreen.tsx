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
import { useShowtime } from '../services/api/useApi';
import { colors } from '../theme';

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
  const { setSelectedShowtime, setSelectedSeats: setStoreSelectedSeats } = useMovieStore();
  const { data: showtime, isLoading, error } = useShowtime(showtimeId);
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setLocalSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (showtime) {
      setSelectedShowtime(showtime);
      const availableSeats = showtime.availableSeats;
      const mockSeats: Seat[] = [];
      
      // Get the theater's seat layout
      const rows = showtime.theater?.seatLayout?.rows || 10;
      const seatsPerRow = showtime.theater?.seatLayout?.seatsPerRow || 20;

      // Generate seats based on theater layout
      for (let row = 0; row < rows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
        for (let number = 1; number <= seatsPerRow; number++) {
          const seatId = `${rowLetter}${number}`;
          mockSeats.push({
            id: seatId,
            row: rowLetter,
            number,
            isAvailable: availableSeats.includes(seatId),
            isSelected: false,
          });
        }
      }
      setSeats(mockSeats);
    }
  }, [showtime, setSelectedShowtime]);

  const handleSeatPress = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((s) =>
        s.id === seat.id ? { ...s, isSelected: !s.isSelected } : s
      );
      
      // Get the new selected seats count
      const selectedCount = updatedSeats.filter((s) => s.isSelected).length;
      
      // If we're trying to select more than 10 seats, don't allow it
      if (selectedCount > 10 && !seat.isSelected) {
        return prevSeats;
      }
      
      return updatedSeats;
    });

    setLocalSelectedSeats((prev) => {
      const isCurrentlySelected = prev.some((s) => s.id === seat.id);
      if (isCurrentlySelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= 10) return prev; // Max 10 seats
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

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.movieTitle}>{showtime?.movie?.title}</Text>
        <Text style={styles.showInfo}>
          {new Date(showtime?.startTime || '').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          {' • '}{showtime?.theater?.name}
        </Text>
      </View>

      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      <ScrollView style={styles.seatsContainer}>
        {Array.from({ length: showtime?.theater?.seatLayout?.rows || 10 }, (_, rowIndex) => {
          const rowLetter = String.fromCharCode(65 + rowIndex);
          return (
            <View key={rowIndex} style={styles.row}>
              <Text style={styles.rowLabel}>{rowLetter}</Text>
              <View style={styles.seats}>
                {seats
                  .filter((seat) => seat.row === rowLetter)
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
          );
        })}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.selectedSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.unavailableSeat]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {selectedSeats.length > 0 && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedCount}>
              {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
            </Text>
            <Text style={styles.selectedSeatsText}>
              {selectedSeats.map(s => s.id).join(', ')}
            </Text>
          </View>
        )}
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
            <Text style={styles.continueButtonText}>
              {selectedSeats.length > 0 ? 'Continue' : 'Select Seats'}
            </Text>
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
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  showInfo: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  screen: {
    height: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 40,
    borderRadius: 4,
  },
  screenText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
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
    color: colors.textSecondary,
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unavailableSeat: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  selectedSeat: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  seatNumber: {
    fontSize: 10,
    color: colors.text,
  },
  unavailableSeatText: {
    color: colors.textSecondary,
  },
  selectedSeatText: {
    color: '#fff',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedInfo: {
    marginBottom: 16,
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedSeatsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  continueButtonText: {
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