import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'movie_theater',
    entities: [User, Movie, Theater, Showtime, Booking],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
  });

  try {
    await dataSource.initialize();
    console.log('Database connection initialized');

    const userRepository = dataSource.getRepository(User);
    const movieRepository = dataSource.getRepository(Movie);
    const theaterRepository = dataSource.getRepository(Theater);
    const showtimeRepository = dataSource.getRepository(Showtime);
    const bookingRepository = dataSource.getRepository(Booking);

    // Clear existing data in the correct order to respect foreign key constraints
    console.log('Clearing existing data...');
    await bookingRepository.query('TRUNCATE TABLE booking CASCADE');
    await showtimeRepository.query('TRUNCATE TABLE showtime CASCADE');
    await movieRepository.query('TRUNCATE TABLE movie CASCADE');
    await theaterRepository.query('TRUNCATE TABLE theater CASCADE');
    await userRepository.query('TRUNCATE TABLE "user" CASCADE');

    // Create sample users
    console.log('Creating sample users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await userRepository.save({
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    });

    const user = await userRepository.save({
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    });

    // Create sample movies
    console.log('Creating sample movies...');
    const movies = await Promise.all([
      movieRepository.save({
        title: 'The Matrix',
        description: 'A computer programmer discovers a mysterious world.',
        duration: 136,
        genre: 'Science Fiction',
        releaseDate: new Date('1999-03-31'),
        posterUrl: 'https://example.com/matrix.jpg',
        rating: 'R',
      }),
      movieRepository.save({
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        duration: 148,
        genre: 'Science Fiction',
        releaseDate: new Date('2010-07-16'),
        posterUrl: 'https://example.com/inception.jpg',
        rating: 'PG-13',
      }),
      movieRepository.save({
        title: 'The Dark Knight',
        description: 'Batman faces his greatest challenge against the Joker.',
        duration: 152,
        genre: 'Action',
        releaseDate: new Date('2008-07-18'),
        posterUrl: 'https://example.com/dark-knight.jpg',
        rating: 'PG-13',
      }),
    ]);

    // Create sample theaters
    console.log('Creating sample theaters...');
    const theaters = await Promise.all([
      theaterRepository.save({
        name: 'Cinema 1',
        location: 'Downtown',
        totalSeats: 100,
        seatLayout: {
          rows: 10,
          seatsPerRow: 10,
        },
      }),
      theaterRepository.save({
        name: 'Cinema 2',
        location: 'Mall',
        totalSeats: 150,
        seatLayout: {
          rows: 15,
          seatsPerRow: 10,
        },
      }),
      theaterRepository.save({
        name: 'Cinema 3',
        location: 'Outskirts',
        totalSeats: 80,
        seatLayout: {
          rows: 8,
          seatsPerRow: 10,
        },
      }),
    ]);

    // Create sample showtimes
    console.log('Creating sample showtimes...');
    const showtimes = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const movie of movies) {
      for (const theater of theaters) {
        for (let i = 0; i < 3; i++) {
          const showtime = new Date(today);
          showtime.setHours(10 + i * 4); // 10:00, 14:00, 18:00
          showtimes.push({
            movie,
            theater,
            startTime: showtime,
            endTime: new Date(showtime.getTime() + movie.duration * 60000),
            price: 12.99,
            availableSeats: theater.totalSeats.toString(),
            seatLayout: theater.seatLayout,
          });
        }
      }
    }

    await showtimeRepository.save(showtimes);
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 