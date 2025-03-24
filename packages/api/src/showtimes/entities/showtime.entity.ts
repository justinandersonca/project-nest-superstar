import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, movie => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Theater, theater => theater.showtimes)
  theater: Theater;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array')
  availableSeats: string[]; // Array of available seat identifiers

  @OneToMany(() => Booking, booking => booking.showtime)
  bookings: Booking[];
} 