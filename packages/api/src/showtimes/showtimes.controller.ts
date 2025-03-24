import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiResponse({ status: 200, description: 'Return all showtimes' })
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showtime by id' })
  @ApiResponse({ status: 200, description: 'Return the showtime' })
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({ status: 201, description: 'Showtime created successfully' })
  create(@Body() data: any) {
    return this.showtimesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a showtime' })
  @ApiResponse({ status: 200, description: 'Showtime updated successfully' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.showtimesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showtime' })
  @ApiResponse({ status: 200, description: 'Showtime deleted successfully' })
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(id);
  }

  @Get('movie/:id')
  @ApiOperation({ summary: 'Get all showtimes for a specific movie' })
  @ApiResponse({ status: 200, description: 'Return all showtimes for the movie' })
  findByMovieId(@Param('id') id: string) {
    return this.showtimesService.findByMovieId(id);
  }
} 