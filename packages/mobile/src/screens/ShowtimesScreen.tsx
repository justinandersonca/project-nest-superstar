import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovieStore } from '../store/movieStore';
import { Showtime } from '../types/data';
import { format } from 'date-fns';

type ShowtimesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Showtimes'>;
  route: RouteProp<RootStackParamList, 'Showtimes'>;
};

export default function ShowtimesScreen({ navigation, route }: ShowtimesScreenProps) {
  const { movieId, theaterId } = route.params;
  const { movies, theaters, getShowtimesForMovieAndTheater } = useMovieStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const movie = movies.find((m) => m.id === movieId);
  const theater = theaters.find((t) => t.id === theaterId);
  const showtimes = getShowtimesForMovieAndTheater(movieId, theaterId);

  useEffect(() => {
    if (movie && theater) {
      navigation.setOptions({
        title: `${movie.title} at ${theater.name}`,
      });
    }
  }, [movie, theater, navigation]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const filteredShowtimes = showtimes.filter((showtime) => {
    const showtimeDate = new Date(showtime.startTime);
    return (
      showtimeDate.getDate() === selectedDate.getDate() &&
      showtimeDate.getMonth() === selectedDate.getMonth() &&
      showtimeDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const handleShowtimeSelect = async (showtime: Showtime) => {
    setLoading(true);
    try {
      // In a real app, this would check seat availability with the backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate('SeatSelection', {
        showtimeId: showtime.id,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!movie || !theater) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie or theater not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(date) => date.toISOString()}
        renderItem={({ item: date }) => (
          <TouchableOpacity
            style={[
              styles.dateButton,
              date.getTime() === selectedDate.getTime() && styles.selectedDateButton,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dateText,
                date.getTime() === selectedDate.getTime() && styles.selectedDateText,
              ]}
            >
              {format(date, 'EEE')}
            </Text>
            <Text
              style={[
                styles.dateNumber,
                date.getTime() === selectedDate.getTime() && styles.selectedDateText,
              ]}
            >
              {format(date, 'd')}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.datesList}
      />

      <FlatList
        data={filteredShowtimes}
        keyExtractor={(item) => item.id}
        renderItem={({ item: showtime }) => (
          <TouchableOpacity
            style={[
              styles.showtimeButton,
              showtime.seatsAvailable < 10 && styles.lowAvailabilityButton,
            ]}
            onPress={() => handleShowtimeSelect(showtime)}
            disabled={showtime.seatsAvailable === 0 || loading}
          >
            <Text style={styles.showtimeText}>
              {format(new Date(showtime.startTime), 'h:mm a')}
            </Text>
            <Text style={styles.priceText}>${showtime.price.toFixed(2)}</Text>
            <Text style={styles.seatsText}>
              {showtime.seatsAvailable === 0
                ? 'Sold Out'
                : showtime.seatsAvailable < 10
                ? `${showtime.seatsAvailable} seats left`
                : 'Available'}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.showtimesList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No showtimes available for this date</Text>
        }
      />

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
  datesList: {
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateButton: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#007AFF',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  showtimesList: {
    flex: 1,
    padding: 16,
  },
  showtimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  lowAvailabilityButton: {
    backgroundColor: '#fff3e0',
  },
  showtimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    color: '#007AFF',
    marginHorizontal: 16,
  },
  seatsText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
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