import { create } from 'zustand';
import { Movie, Theater, Showtime } from '../types/data';

interface BookingState {
  selectedMovie: Movie | null;
  selectedTheater: Theater | null;
  selectedShowtime: Showtime | null;
  selectedSeats: string[];
  selectedTickets: Record<string, number>;
  setSelectedMovie: (movie: Movie) => void;
  setSelectedTheater: (theater: Theater) => void;
  setSelectedShowtime: (showtime: Showtime) => void;
  setSelectedSeats: (seats: string[]) => void;
  setTickets: (tickets: Record<string, number>) => void;
  clearBooking: () => void;
}

export const useMovieStore = create<BookingState>((set, get) => ({
  selectedMovie: null,
  selectedTheater: null,
  selectedShowtime: null,
  selectedSeats: [],
  selectedTickets: {},
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setSelectedTheater: (theater) => set({ selectedTheater: theater }),
  setSelectedShowtime: (showtime) => set({ selectedShowtime: showtime }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setTickets: (tickets) => set({ selectedTickets: tickets }),
  clearBooking: () => set({
    selectedMovie: null,
    selectedTheater: null,
    selectedShowtime: null,
    selectedSeats: [],
    selectedTickets: {},
  }),
})); 