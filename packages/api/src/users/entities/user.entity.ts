import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Column()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  @ApiProperty({ example: 'user' })
  role: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
} 