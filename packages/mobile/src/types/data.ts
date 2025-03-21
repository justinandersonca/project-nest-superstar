export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  duration: number; // in minutes
  rating: string;
  genre: string[];
  synopsis: string;
  releaseDate: string;
}

export interface Theater {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  amenities: string[];
  screens: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  screen: number;
  seatsAvailable: number;
  totalSeats: number;
  price: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'occupied';
  type: 'standard' | 'premium' | 'handicap';
}

export interface Ticket {
  id: string;
  showtimeId: string;
  seats: string[]; // array of seat IDs
  totalPrice: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
} 