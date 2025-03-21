import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useMovieStore } from '../store/movieStore';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Theater } from '../types/data';

type RootStackParamList = {
  TheaterDetails: { theaterId: string };
};

type TheaterDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TheaterDetails'>;

export default function TheaterDetailsScreen() {
  const route = useRoute<TheaterDetailsScreenRouteProp>();
  const { theaters } = useMovieStore();
  const theater = theaters.find(t => t.id === route.params.theaterId);

  if (!theater) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Theater not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{theater.name}</Text>
        <Text style={styles.address}>{theater.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.locationText}>
            {theater.location.latitude.toFixed(6)}, {theater.location.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {theater.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.facilityItem}>
          <Ionicons name="film" size={20} color={colors.primary} />
          <Text style={styles.facilityText}>{theater.screens} Screens</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: 16,
    backgroundColor: colors.surface,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
}); 