import { Body, Controller, Get, Patch, Query, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('search')
  async searchFlights(
    @Query('source') source: string,
    @Query('destination') destination: string,
    @Query('date') date: Date,
    @Query('cabin_class') cabinClass?: string,
    @Query('passengers') passengers?: number,
  ) {
    return this.flightsService.searchFlights(source, destination, date);
  }

  @Get(':id')
  async getFlightById(@Param('id') id: string) {
    return this.flightsService.getFlightById(id);
  }

  @Patch('update-status')
  async updateFlightStatus(
    @Body() body: { flight_id: string; status: string },
  ) {
    return this.flightsService.updateFlightStatus(body.flight_id, body.status);
  }
}
