import { create } from 'zustand';
import { Movie, ShowTime, Seat, FoodItem } from '../types';

interface BookingState {
  selectedMovie: Movie | null;
  selectedShowtime: ShowTime | null;
  selectedSeats: Seat[];
  selectedTickets: {
    id: string;
    type: 'adult' | 'child' | 'senior';
    price: number;
    quantity: number;
  }[];
  selectedFoodItems: FoodItem[];
  total: number;
}

interface BookingActions {
  setMovie: (movie: Movie) => void;
  setShowtime: (showtime: ShowTime) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seat: Seat) => void;
  setTickets: (tickets: {
    id: string;
    type: 'adult' | 'child' | 'senior';
    price: number;
    quantity: number;
  }[]) => void;
  addFoodItem: (item: FoodItem) => void;
  removeFoodItem: (item: FoodItem) => void;
  calculateTotal: () => void;
  clearBooking: () => void;
}

const initialState: BookingState = {
  selectedMovie: null,
  selectedShowtime: null,
  selectedSeats: [],
  selectedTickets: [],
  selectedFoodItems: [],
  total: 0,
};

type Store = BookingState & BookingActions;

export const useBookingStore = create<Store>((set) => ({
  ...initialState,
  setMovie: (movie) => set({ selectedMovie: movie }),
  setShowtime: (showtime) => set({ selectedShowtime: showtime }),
  addSeat: (seat) =>
    set((state) => ({
      selectedSeats: [...(state.selectedSeats || []), seat],
    })),
  removeSeat: (seat) =>
    set((state) => ({
      selectedSeats: (state.selectedSeats || []).filter((s) => s.id !== seat.id),
    })),
  setTickets: (tickets) => set({ selectedTickets: tickets }),
  addFoodItem: (item) =>
    set((state) => ({
      selectedFoodItems: [...(state.selectedFoodItems || []), item],
    })),
  removeFoodItem: (item) =>
    set((state) => ({
      selectedFoodItems: (state.selectedFoodItems || []).filter((i) => i.id !== item.id),
    })),
  calculateTotal: () =>
    set((state) => {
      const ticketTotal = (state.selectedTickets || []).reduce(
        (sum, ticket) => sum + ticket.price * ticket.quantity,
        0
      );
      const foodTotal = (state.selectedFoodItems || []).reduce(
        (sum, item) => sum + item.price,
        0
      );
      return { total: ticketTotal + foodTotal };
    }),
  clearBooking: () => set(initialState),
})); 