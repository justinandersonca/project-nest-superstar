import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Movie, Showtime, Theater, Booking } from '../../types/data';

// For development, use local IP for iOS simulator or 10.0.2.2 for Android emulator
const API_URL = Platform.select({
  ios: 'http://192.168.1.190:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle auth token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config?.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
    });
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('token');
      // Navigate to login screen
      // You'll need to implement navigation here
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (data: { email: string; password: string; name: string }) => {
  const response = await api.post('/api/auth/register', data);
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Movie endpoints
export const getMovies = async () => {
  const response = await api.get<Movie[]>('/api/movies');
  return response.data;
};

export const getMovie = async (id: string) => {
  const response = await api.get<Movie>(`/api/movies/${id}`);
  return response.data;
};

// Showtime endpoints
export const getShowtimes = async () => {
  const response = await api.get<Showtime[]>('/api/showtimes');
  return response.data;
};

export const getShowtime = async (id: string) => {
  const response = await api.get<Showtime>(`/api/showtimes/${id}`);
  return response.data;
};

export const getShowtimesByMovie = async (movieId: string) => {
  const response = await api.get<Showtime[]>(`/api/showtimes/movie/${movieId}`);
  return response.data;
};

// Theater endpoints
export const getTheaters = async () => {
  const response = await api.get<Theater[]>('/api/theaters');
  return response.data;
};

export const getTheater = async (id: string) => {
  const response = await api.get<Theater>(`/api/theaters/${id}`);
  return response.data;
};

// Booking endpoints
export const createBooking = async (data: {
  showtimeId: string;
  seats: string[];
  ticketTypes: Record<string, number>;
}) => {
  const response = await api.post<Booking>('/api/bookings', data);
  return response.data;
};

export const getBookings = async () => {
  const response = await api.get<Booking[]>('/api/bookings');
  return response.data;
};

export const getBooking = async (id: string) => {
  const response = await api.get<Booking>(`/api/bookings/${id}`);
  return response.data;
};

export default api; 