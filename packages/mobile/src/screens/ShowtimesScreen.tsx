import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useMovie, useTheater, useShowtimesByMovie } from '../services/api/useApi';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type ShowtimesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Showtimes'>;
  route: RouteProp<RootStackParamList, 'Showtimes'>;
};

export default function ShowtimesScreen({ navigation, route }: ShowtimesScreenProps) {
  const { movieId, theaterId } = route.params;
  const { data: movie, isLoading: isLoadingMovie } = useMovie(movieId);
  const { data: theater, isLoading: isLoadingTheater } = useTheater(theaterId);
  const { data: showtimes, isLoading: isLoadingShowtimes } = useShowtimesByMovie(movieId);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (isLoadingMovie || isLoadingTheater || isLoadingShowtimes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie || !theater || !showtimes) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading showtimes. Please try again later.</Text>
      </View>
    );
  }

  const handleShowtimeSelect = (showtimeId: string) => {
    navigation.navigate('SeatSelection', { showtimeId });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const getOffsetTime = (dateString: string, offsetMinutes: number) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - offsetMinutes);
    return formatTime(date.toISOString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: movie.imageUrl }} style={styles.movieImage} />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.duration}>{movie.duration} MIN | PG-13</Text>
          </View>
        </View>

        <View style={styles.theaterInfo}>
          <Text style={styles.theaterName}>{theater.name}</Text>
          <Text style={styles.theaterLocation}>{theater.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IMAX WITH LASER AT AMC</Text>
          <Text style={styles.sectionSubtitle}>EXTRAORDINARY AWAITS</Text>
          <View style={styles.amenities}>
            <Text style={styles.amenityText}>Reserved Seating</Text>
            <Text style={styles.amenityText}>IMAX at AMC</Text>
            <Text style={styles.amenityText}>Closed Caption</Text>
            <Text style={styles.amenityText}>Audio Description</Text>
          </View>
          <View style={styles.showtimes}>
            {showtimes.map((showtime) => (
              <TouchableOpacity
                key={showtime.id}
                style={styles.showtimeButton}
                onPress={() => handleShowtimeSelect(showtime.id)}
              >
                <Text style={styles.showtimeText}>
                  {formatTime(showtime.startTime)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIME</Text>
          <Text style={styles.sectionSubtitle}>PERCEIVE THE POWER</Text>
          <View style={styles.amenities}>
            <Text style={styles.amenityText}>AMC Signature Recliners</Text>
            <Text style={styles.amenityText}>Reserved Seating</Text>
            <Text style={styles.amenityText}>Closed Caption</Text>
            <Text style={styles.amenityText}>Audio Description</Text>
          </View>
          <View style={styles.showtimes}>
            {showtimes.map((showtime) => (
              <TouchableOpacity
                key={`prime-${showtime.id}`}
                style={styles.showtimeButton}
                onPress={() => handleShowtimeSelect(showtime.id)}
              >
                <Text style={styles.showtimeText}>
                  {getOffsetTime(showtime.startTime, 30)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.discountText}>UP TO 20% OFF</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  movieImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  theaterInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  theaterLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 16,
    marginBottom: 8,
  },
  showtimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  showtimeButton: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  showtimeText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  discountText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
}); 