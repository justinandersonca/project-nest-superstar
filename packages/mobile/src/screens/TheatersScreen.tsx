import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useMovieStore } from '../store/movieStore';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Theater } from '../types/data';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TheaterDetails: { theaterId: string };
};

export default function TheatersScreen() {
  const { theaters } = useMovieStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderTheaterItem = ({ item }: { item: Theater }) => (
    <TouchableOpacity
      style={styles.theaterCard}
      onPress={() => navigation.navigate('TheaterDetails', { theaterId: item.id })}
    >
      <View style={styles.theaterHeader}>
        <Text style={styles.theaterName}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.amenitiesContainer}>
        {item.amenities.map((amenity: string, index: number) => (
          <View key={index} style={styles.amenityTag}>
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.screens}>{item.screens} screens</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Theaters</Text>
      <FlatList
        data={theaters}
        renderItem={renderTheaterItem}
        keyExtractor={(item: Theater) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  theaterCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  theaterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  amenityTag: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: colors.text,
  },
  screens: {
    fontSize: 14,
    color: colors.textSecondary,
  },
}); 