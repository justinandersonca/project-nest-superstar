import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMovieStore } from '../store/movieStore';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

export default function MovieDetailsScreen() {
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { movies, theaters, setSelectedMovie } = useMovieStore();
  const [showTheaterModal, setShowTheaterModal] = useState(false);
  const movie = movies.find(m => m.id === route.params.movieId);

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const handleBuyTickets = () => {
    setSelectedMovie(movie);
    setShowTheaterModal(true);
  };

  const handleTheaterSelect = (theaterId: string) => {
    setShowTheaterModal(false);
    navigation.navigate('Showtimes', { movieId: movie.id, theaterId });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{movie.duration} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{movie.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{new Date(movie.releaseDate).toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.genreContainer}>
            {movie.genre.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis}>{movie.synopsis}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyTickets}>
          <Text style={styles.buyButtonText}>Buy Tickets</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTheaterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTheaterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Theater</Text>
              <TouchableOpacity
                onPress={() => setShowTheaterModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={theaters}
              keyExtractor={(item) => item.id}
              renderItem={({ item: theater }) => (
                <TouchableOpacity
                  style={styles.theaterItem}
                  onPress={() => handleTheaterSelect(theater.id)}
                >
                  <Text style={styles.theaterName}>{theater.name}</Text>
                  <Text style={styles.theaterAddress}>{theater.address}</Text>
                  <View style={styles.amenitiesContainer}>
                    {theater.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityTag}>
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 14,
    color: colors.text,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  theaterItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
}); 