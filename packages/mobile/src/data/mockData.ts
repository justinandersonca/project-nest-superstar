import { Movie, Theater, Showtime } from '../types/data';

const movies: Movie[] = [
  {
    id: '1',
    title: 'The Dark Knight',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    duration: 152,
    rating: 'PG-13',
    genre: ['Action', 'Crime', 'Drama'],
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseDate: '2008-07-18',
  },
  {
    id: '2',
    title: 'Inception',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    duration: 148,
    rating: 'PG-13',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: '2010-07-16',
  },
  {
    id: '3',
    title: 'The Matrix',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    duration: 136,
    rating: 'R',
    genre: ['Action', 'Sci-Fi'],
    synopsis: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    releaseDate: '1999-03-31',
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    posterUrl: 'https://example.com/pulp-fiction.jpg',
    duration: 154,
    rating: 'R',
    genre: ['Crime', 'Drama'],
    synopsis: 'Various interconnected stories of criminals in Los Angeles.',
    releaseDate: '1994-10-14',
  },
  {
    id: '5',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://example.com/shawshank.jpg',
    duration: 142,
    rating: 'R',
    genre: ['Drama'],
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: '1994-09-23',
  },
  {
    id: '6',
    title: 'The Godfather',
    posterUrl: 'https://example.com/godfather.jpg',
    duration: 175,
    rating: 'R',
    genre: ['Crime', 'Drama'],
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseDate: '1972-03-24',
  },
  {
    id: '7',
    title: 'Fight Club',
    posterUrl: 'https://example.com/fight-club.jpg',
    duration: 139,
    rating: 'R',
    genre: ['Drama', 'Thriller'],
    synopsis: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.',
    releaseDate: '1999-10-15',
  },
  {
    id: '8',
    title: 'Forrest Gump',
    posterUrl: 'https://example.com/forrest-gump.jpg',
    duration: 142,
    rating: 'PG-13',
    genre: ['Drama', 'Romance'],
    synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    releaseDate: '1994-07-06',
  },
];

const theaters: Theater[] = [
  {
    id: '1',
    name: 'AMC Downtown',
    address: '123 Main St, Downtown',
    location: { latitude: 37.7749, longitude: -122.4194 },
    amenities: ['IMAX', 'Dolby Atmos', 'Recliner Seats'],
    screens: 12,
  },
  {
    id: '2',
    name: 'Regal Cinemas',
    address: '456 Market St, Financial District',
    location: { latitude: 37.7898, longitude: -122.3972 },
    amenities: ['Dolby Vision', 'Premium Seating'],
    screens: 8,
  },
  {
    id: '3',
    name: 'Century Theaters',
    address: '789 Mission St, SoMa',
    location: { latitude: 37.7833, longitude: -122.4167 },
    amenities: ['4DX', 'ScreenX'],
    screens: 10,
  },
  {
    id: '4',
    name: 'Landmark Theaters',
    address: '321 Valencia St, Mission',
    location: { latitude: 37.7599, longitude: -122.4148 },
    amenities: ['Art House', 'Premium Seating'],
    screens: 6,
  },
  {
    id: '5',
    name: 'Alamo Drafthouse',
    address: '654 Castro St, Castro',
    location: { latitude: 37.7609, longitude: -122.4350 },
    amenities: ['Dine-in Service', 'Premium Seating'],
    screens: 8,
  },
  {
    id: '6',
    name: 'Roxie Theater',
    address: '987 16th St, Mission',
    location: { latitude: 37.7639, longitude: -122.4194 },
    amenities: ['Historic Venue', 'Independent Films'],
    screens: 3,
  },
];

const generateShowtimes = (): Showtime[] => {
  const showtimes: Showtime[] = [];
  const now = new Date();
  const basePrice = 14.99;

  // Generate showtimes for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);

    // Generate 4-6 showtimes per day for each movie at each theater
    movies.forEach((movie) => {
      theaters.forEach((theater) => {
        // Fixed showtimes for better predictability
        const fixedTimes = ['10:30', '13:45', '16:15', '19:00', '21:30'];

        fixedTimes.forEach((time) => {
          const [hours, minutes] = time.split(':').map(Number);
          const showtimeDate = new Date(date);
          showtimeDate.setHours(hours, minutes, 0, 0);

          // Skip showtimes that are in the past
          if (showtimeDate < now) {
            return;
          }

          // Calculate price based on factors
          let price = basePrice;
          if (theater.amenities.includes('IMAX')) price += 5;
          if (theater.amenities.includes('Dolby Atmos')) price += 3;
          if (movie.rating === 'R') price += 2;
          if (hours >= 18) price += 2; // Evening premium
          if (day === 0 || day === 6) price += 3; // Weekend premium

          // Generate a stable ID for consistent reference
          const stableId = `${movie.id}-${theater.id}-${date.toISOString().split('T')[0]}-${time}`;

          showtimes.push({
            id: stableId,
            movieId: movie.id,
            theaterId: theater.id,
            startTime: showtimeDate.toISOString(),
            endTime: new Date(showtimeDate.getTime() + movie.duration * 60000).toISOString(),
            price: Math.round(price * 100) / 100, // Round to 2 decimal places
            seatsAvailable: Math.floor(Math.random() * 30) + 70, // 70-100 seats available
            screen: Math.floor(Math.random() * theater.screens) + 1,
            totalSeats: 100,
          });
        });
      });
    });
  }

  return showtimes;
};

export const generateMockData = () => ({
  movies,
  theaters,
  showtimes: generateShowtimes(),
}); 