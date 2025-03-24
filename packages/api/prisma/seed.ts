import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
      name: 'Admin User',
    },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  // Create theaters
  const theater1 = await prisma.theater.upsert({
    where: { id: '1' },
    update: {
      name: 'Cinema One',
      location: '123 Main St, City Center',
      totalSeats: 200,
      seatLayout: {
        rows: 10,
        seatsPerRow: 20,
      },
    },
    create: {
      id: '1',
      name: 'Cinema One',
      location: '123 Main St, City Center',
      totalSeats: 200,
      seatLayout: {
        rows: 10,
        seatsPerRow: 20,
      },
    },
  });

  const theater2 = await prisma.theater.upsert({
    where: { id: '2' },
    update: {
      name: 'Movie Palace',
      location: '456 Entertainment Ave, Downtown',
      totalSeats: 300,
      seatLayout: {
        rows: 15,
        seatsPerRow: 20,
      },
    },
    create: {
      id: '2',
      name: 'Movie Palace',
      location: '456 Entertainment Ave, Downtown',
      totalSeats: 300,
      seatLayout: {
        rows: 15,
        seatsPerRow: 20,
      },
    },
  });

  // Create movies
  const movie1 = await prisma.movie.upsert({
    where: { id: '1' },
    update: {
      title: 'The Adventure Begins',
      description: 'An epic tale of adventure and discovery.',
      duration: 120,
      imageUrl: 'https://picsum.photos/800/1200?random=1',
    },
    create: {
      id: '1',
      title: 'The Adventure Begins',
      description: 'An epic tale of adventure and discovery.',
      duration: 120,
      imageUrl: 'https://picsum.photos/800/1200?random=1',
    },
  });

  const movie2 = await prisma.movie.upsert({
    where: { id: '2' },
    update: {
      title: 'Mystery of the Night',
      description: 'A thrilling mystery that will keep you on the edge of your seat.',
      duration: 110,
      imageUrl: 'https://picsum.photos/800/1200?random=2',
    },
    create: {
      id: '2',
      title: 'Mystery of the Night',
      description: 'A thrilling mystery that will keep you on the edge of your seat.',
      duration: 110,
      imageUrl: 'https://picsum.photos/800/1200?random=2',
    },
  });

  // Create showtimes
  const showtime1 = await prisma.showtime.upsert({
    where: { id: '1' },
    update: {
      startTime: new Date('2024-03-22T14:00:00Z'),
      endTime: new Date('2024-03-22T16:00:00Z'),
      price: 12.99,
      availableSeats: Array.from({ length: 200 }, (_, i) => `A${i + 1}`),
      movieId: movie1.id,
      theaterId: theater1.id,
    },
    create: {
      id: '1',
      startTime: new Date('2024-03-22T14:00:00Z'),
      endTime: new Date('2024-03-22T16:00:00Z'),
      price: 12.99,
      availableSeats: Array.from({ length: 200 }, (_, i) => `A${i + 1}`),
      movieId: movie1.id,
      theaterId: theater1.id,
    },
  });

  const showtime2 = await prisma.showtime.upsert({
    where: { id: '2' },
    update: {
      startTime: new Date('2024-03-22T17:00:00Z'),
      endTime: new Date('2024-03-22T19:00:00Z'),
      price: 12.99,
      availableSeats: Array.from({ length: 300 }, (_, i) => `A${i + 1}`),
      movieId: movie2.id,
      theaterId: theater2.id,
    },
    create: {
      id: '2',
      startTime: new Date('2024-03-22T17:00:00Z'),
      endTime: new Date('2024-03-22T19:00:00Z'),
      price: 12.99,
      availableSeats: Array.from({ length: 300 }, (_, i) => `A${i + 1}`),
      movieId: movie2.id,
      theaterId: theater2.id,
    },
  });

  console.log('Seed data created:', {
    admin,
    theater1,
    theater2,
    movie1,
    movie2,
    showtime1,
    showtime2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 