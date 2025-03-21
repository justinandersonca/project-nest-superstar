export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  rating: number;
  genre: string;
  duration: number;
  releaseDate: string;
}

export interface ShowTime {
  id: string;
  movieId: string;
  time: string;
  format: string;
  date: string;
  theater: string;
  amenities: string[];
  price: {
    standard: number;
    premium: number;
  };
}

export interface Theater {
  id: string;
  name: string;
  address: string;
  amenities: string[];
  screens: number;
  showtimes: Showtime[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'occupied';
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'snack' | 'drink' | 'candy';
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
} 