import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('search')
  async searchFlights(
    @Query('source') source: string,
    @Query('destination') destination: string,
    @Query('date') date: Date,
  ) {
    return this.flightsService.searchFlights(source, destination, date);
  }
}
