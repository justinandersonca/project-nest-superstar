import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number; // in minutes

  @Column()
  genre: string;

  @Column()
  releaseDate: Date;

  @Column()
  posterUrl: string;

  @Column()
  rating: string;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];
} 