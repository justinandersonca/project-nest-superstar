import { Module } from '@nestjs/common';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TheatersController],
  providers: [TheatersService],
})
export class TheatersModule {} 