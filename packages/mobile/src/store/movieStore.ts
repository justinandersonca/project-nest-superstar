import { create } from 'zustand';
import { Movie, Theater, Showtime } from '../types/data';
import { generateMockData } from '../data/mockData';

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

interface MovieStore extends BookingState {
  movies: Movie[];
  theaters: Theater[];
  showtimes: Showtime[];
  getShowtimeById: (id: string) => Showtime | undefined;
  getShowtimesForMovieAndTheater: (movieId: string, theaterId: string) => Showtime[];
  purchaseTickets: () => Promise<string>;
}

const mockData = generateMockData();

export const useMovieStore = create<MovieStore>((set, get) => ({
  movies: mockData.movies,
  theaters: mockData.theaters,
  showtimes: mockData.showtimes,
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
  getShowtimeById: (id) => {
    return get().showtimes.find((showtime) => showtime.id === id);
  },
  getShowtimesForMovieAndTheater: (movieId, theaterId) => {
    return get().showtimes.filter(
      (showtime) => showtime.movieId === movieId && showtime.theaterId === theaterId
    );
  },
  purchaseTickets: async () => {
    const { selectedShowtime, selectedSeats, selectedTickets } = get();
    if (!selectedShowtime) throw new Error('No showtime selected');

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a random order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Update available seats
    set((state) => ({
      showtimes: state.showtimes.map((showtime) =>
        showtime.id === selectedShowtime.id
          ? {
              ...showtime,
              seatsAvailable: showtime.seatsAvailable - selectedSeats.length,
            }
          : showtime
      ),
    }));

    // Clear booking state
    get().clearBooking();

    return orderId;
  },
})); 