import { create } from 'zustand';
import { Movie, ShowTime, Theater, Seat, FoodItem } from './types';

interface BookingState {
  selectedMovie: Movie | null;
  selectedShowtime: ShowTime | null;
  selectedSeats: Seat[];
  selectedFoodItems: FoodItem[];
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedShowtime: (showtime: ShowTime | null) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  addFoodItem: (item: FoodItem) => void;
  removeFoodItem: (item: FoodItem) => void;
  calculateTotal: () => number;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedMovie: null,
  selectedShowtime: null,
  selectedSeats: [],
  selectedFoodItems: [],
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setSelectedShowtime: (showtime) => set({ selectedShowtime: showtime }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  addFoodItem: (item) =>
    set((state) => ({
      selectedFoodItems: [...state.selectedFoodItems, item],
    })),
  removeFoodItem: (item) =>
    set((state) => ({
      selectedFoodItems: state.selectedFoodItems.filter((i) => i.id !== item.id),
    })),
  calculateTotal: () => {
    const state = get();
    let total = 0;

    // Add seat costs
    if (state.selectedShowtime) {
      total += state.selectedSeats.length * state.selectedShowtime.price.standard;
    }

    // Add food items
    total += state.selectedFoodItems.reduce((sum, item) => sum + item.price, 0);

    return total;
  },
  reset: () =>
    set({
      selectedMovie: null,
      selectedShowtime: null,
      selectedSeats: [],
      selectedFoodItems: [],
    }),
})); 