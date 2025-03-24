import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.showtime.findMany({
      include: {
        movie: true,
        theater: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        theater: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.showtime.create({
      data,
      include: {
        movie: true,
        theater: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.showtime.update({
      where: { id },
      data,
      include: {
        movie: true,
        theater: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.showtime.delete({
      where: { id },
    });
  }

  async findByMovieId(movieId: string) {
    return this.prisma.showtime.findMany({
      where: {
        movieId,
      },
      include: {
        movie: true,
        theater: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
} 