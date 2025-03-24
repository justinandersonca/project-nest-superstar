import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useMovies, useShowtimes } from '../services/api/useApi';
import { colors } from '../theme';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { data: movies, isLoading: isLoadingMovies } = useMovies();
  const { data: showtimes, isLoading: isLoadingShowtimes } = useShowtimes();

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numericPrice.toFixed(2)}`;
  };

  if (isLoadingMovies || isLoadingShowtimes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Now Showing</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies?.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieCard}
              onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
            >
              <Image source={{ uri: movie.imageUrl }} style={styles.poster} />
              <Text style={styles.movieTitle}>{movie.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies?.slice(0, 5).map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieCard}
              onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
            >
              <Image source={{ uri: movie.imageUrl }} style={styles.poster} />
              <Text style={styles.movieTitle}>{movie.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Showtimes</Text>
        {showtimes?.slice(0, 5).map((showtime) => (
          <TouchableOpacity
            key={showtime.id}
            style={styles.showtimeCard}
            onPress={() => {
              if (showtime.movie?.id) {
                navigation.navigate('MovieDetails', { movieId: showtime.movie.id });
              }
            }}
          >
            <View style={styles.showtimeInfo}>
              <Text style={styles.showtimeTitle}>{showtime.movie?.title}</Text>
              <Text style={styles.showtimeTime}>
                {new Date(showtime.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={styles.showtimePrice}>{formatPrice(showtime.price)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  movieCard: {
    width: 120,
    marginRight: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  showtimeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  showtimeInfo: {
    flex: 1,
  },
  showtimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  showtimeTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  showtimePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
}); 