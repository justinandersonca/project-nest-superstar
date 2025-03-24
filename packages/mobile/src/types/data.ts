export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  imageUrl: string;
  posterUrl?: string; // For backward compatibility
  rating?: string;
  genre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  totalSeats: number;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: string[];
  movie?: Movie;
  theater?: Theater;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  showtime?: Showtime;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
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