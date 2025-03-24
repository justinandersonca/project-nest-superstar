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
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { useMovie, useTheaters } from '../services/api/useApi';

const { width } = Dimensions.get('window');

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

export default function MovieDetailsScreen() {
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useMovie(route.params.movieId);
  const { data: theaters, isLoading: isLoadingTheaters } = useTheaters();
  const [showTheaterModal, setShowTheaterModal] = useState(false);

  if (isLoadingMovie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (movieError || !movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading movie details. Please try again later.</Text>
      </View>
    );
  }

  const handleBuyTickets = () => {
    setShowTheaterModal(true);
  };

  const handleTheaterSelect = (theaterId: string) => {
    setShowTheaterModal(false);
    navigation.navigate('Showtimes', { movieId: movie.id, theaterId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} bounces={false}>
        <Image source={{ uri: movie.imageUrl }} style={styles.poster} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.duration}>{movie.duration} MIN</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.rating}>PG-13</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.description}>{movie.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getTicketsButton} onPress={handleBuyTickets}>
          <Text style={styles.getTicketsText}>Get Tickets</Text>
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
            {isLoadingTheaters ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <FlatList
                data={theaters}
                keyExtractor={(item) => item.id}
                renderItem={({ item: theater }) => (
                  <TouchableOpacity
                    style={styles.theaterItem}
                    onPress={() => handleTheaterSelect(theater.id)}
                  >
                    <Text style={styles.theaterName}>{theater.name}</Text>
                    <Text style={styles.theaterLocation}>{theater.location}</Text>
                    <View style={styles.amenitiesContainer}>
                      <Text style={styles.amenityText}>
                        {theater.totalSeats} seats • {theater.seatLayout.rows} rows
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.theaterList}
              />
            )}
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  poster: {
    width: width,
    height: width * 1.5,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  duration: {
    fontSize: 16,
    color: colors.text,
  },
  separator: {
    fontSize: 16,
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  rating: {
    fontSize: 16,
    color: colors.text,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  getTicketsButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  getTicketsText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
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
    padding: 20,
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
  theaterList: {
    padding: 20,
  },
  theaterItem: {
    marginBottom: 24,
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
    marginBottom: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
}); 