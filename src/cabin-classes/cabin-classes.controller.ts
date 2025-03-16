import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { CabinClassesService } from './cabin-classes.service';

@Controller('cabin-classes')
export class CabinClassesController {
  constructor(private readonly cabinClassesService: CabinClassesService) {}

  @Get('flight/:flightId')
  async findByFlightId(@Param('flightId') flightId: string) {
    return this.cabinClassesService.findByFlightId(flightId);
  }

  @Get('flight/:flightId/class/:classType')
  async findByFlightIdAndClassType(
    @Param('flightId') flightId: string,
    @Param('classType') classType: string,
  ) {
    return this.cabinClassesService.findByFlightIdAndClassType(
      flightId,
      classType,
    );
  }

  @Patch(':id/available-seats')
  async updateAvailableSeats(
    @Param('id') id: string,
    @Body() body: { availableSeats: number },
  ) {
    return this.cabinClassesService.updateAvailableSeats(
      id,
      body.availableSeats,
    );
  }
}
