import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.movie.findMany();
  }

  async findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.movie.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
} 