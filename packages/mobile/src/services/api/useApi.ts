import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  getMovies,
  getMovie,
  getShowtimes,
  getShowtime,
  getShowtimesByMovie,
  getTheaters,
  getTheater,
  createBooking,
  getBookings,
  getBooking,
} from './api';
import { Movie, Theater, Showtime } from '../../types/data';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onError: (error) => {
      console.error('Login error:', error);
      throw error;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      register(data),
    onError: (error) => {
      console.error('Register error:', error);
      throw error;
    },
  });
};

// Movie hooks
export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovie(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Showtime hooks
export const useShowtimes = () => {
  return useQuery({
    queryKey: ['showtimes'],
    queryFn: getShowtimes,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useShowtime = (id: string) => {
  return useQuery({
    queryKey: ['showtime', id],
    queryFn: () => getShowtime(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useShowtimesByMovie = (movieId: string) => {
  return useQuery({
    queryKey: ['showtimes', 'movie', movieId],
    queryFn: () => getShowtimesByMovie(movieId),
    enabled: !!movieId,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

// Theater hooks
export const useTheaters = () => {
  return useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useTheater = (id: string) => {
  return useQuery({
    queryKey: ['theater', id],
    queryFn: () => getTheater(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Booking hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      showtimeId: string;
      seats: string[];
      ticketTypes: Record<string, number>;
    }) => createBooking(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Create booking error:', error);
      throw error;
    },
  });
};

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
}; 