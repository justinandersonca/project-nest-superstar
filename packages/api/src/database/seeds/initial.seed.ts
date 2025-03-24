import { DataSource } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

export async function seedInitialData(dataSource: DataSource) {
  const movieRepository = dataSource.getRepository(Movie);
  const theaterRepository = dataSource.getRepository(Theater);
  const showtimeRepository = dataSource.getRepository(Showtime);

  // Create a movie
  const movie = await movieRepository.save({
    title: 'The Matrix',
    description: 'A computer programmer discovers a mysterious world.',
    duration: 136,
    genre: 'Sci-Fi',
    releaseDate: new Date('1999-03-31'),
    posterUrl: 'https://example.com/matrix.jpg',
    rating: 'R',
  });

  // Create a theater
  const theater = await theaterRepository.save({
    name: 'Cinema 1',
    location: 'Downtown',
    totalSeats: 100,
    seatLayout: {
      rows: 10,
      seatsPerRow: 10,
    },
  });

  // Create showtimes
  const now = new Date();
  const showtimes = [
    {
      movie,
      theater,
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
      price: 12.99,
      availableSeats: Array.from({ length: 100 }, (_, i) => `A${i + 1}`),
    },
    {
      movie,
      theater,
      startTime: new Date(now.getTime() + 5 * 60 * 60 * 1000), // 5 hours from now
      endTime: new Date(now.getTime() + 7 * 60 * 60 * 1000), // 7 hours from now
      price: 12.99,
      availableSeats: Array.from({ length: 100 }, (_, i) => `A${i + 1}`),
    },
  ];

  await showtimeRepository.save(showtimes);
} 