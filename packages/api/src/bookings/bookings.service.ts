import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.booking.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
} 