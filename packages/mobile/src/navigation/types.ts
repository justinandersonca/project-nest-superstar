import { NavigatorScreenParams } from '@react-navigation/native';
import { Movie, ShowTime, Theater, Seat } from '../types';
import { Movie as MovieData } from '../types/data';

export type MainTabParamList = {
  Home: undefined;
  Theaters: undefined;
  Tickets: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetails: { movieId: string };
  Showtimes: { movieId: string; theaterId: string };
  SeatSelection: { showtimeId: string };
  TicketSelection: { showtimeId: string; selectedSeats: string[] };
  BookingConfirmation: { showtimeId: string; selectedSeats: string[]; ticketTypes: { [key: string]: number } };
  Payment: undefined;
  OrderConfirmation: { orderId: string };
  TheaterDetails: { theater: Theater };
  FoodAndDrinks: undefined;
}; 