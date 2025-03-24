export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  duration: number;
  description: string;
  rating?: string;
  genre?: string;
  releaseDate?: string;
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

export type Seat = {
  id: string;
  row: string;
  number: string;
  type: 'standard' | 'recliner' | 'wheelchair';
  status: 'available' | 'occupied' | 'selected' | 'wheelchair';
};

export interface Theater {
  id: string;
  name: string;
  address: string;
  amenities: string[];
}

export type Ticket = {
  id: string;
  movieId: string;
  showTimeId: string;
  seats: string[];
  type: 'adult' | 'child' | 'senior';
  price: number;
};

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: 'combo' | 'snack' | 'drink' | 'candy';
} 