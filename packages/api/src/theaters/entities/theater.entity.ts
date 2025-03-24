import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Column()
  @ApiProperty({ example: 'Cinema 1' })
  name: string;

  @Column()
  @ApiProperty({ example: 'Downtown' })
  location: string;

  @Column()
  @ApiProperty({ example: 100 })
  totalSeats: number;

  @Column('jsonb')
  @ApiProperty({
    example: {
      rows: 10,
      seatsPerRow: 10,
    },
  })
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };

  @OneToMany(() => Showtime, (showtime) => showtime.theater)
  showtimes: Showtime[];
} 