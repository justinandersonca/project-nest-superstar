import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.theater.findMany();
  }

  async findOne(id: string) {
    return this.prisma.theater.findUnique({
      where: { id },
    });
  }
} 