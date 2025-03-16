import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { Passenger } from './passenger.entity';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get('booking/:bookingId')
  async findByBookingId(@Param('bookingId') bookingId: string) {
    return this.passengersService.findByBookingId(bookingId);
  }

  @Post()
  async createPassenger(@Body() passengerData: Partial<Passenger>) {
    return this.passengersService.createPassenger(passengerData);
  }

  @Patch(':id')
  async updatePassenger(
    @Param('id') id: string,
    @Body() passengerData: Partial<Passenger>,
  ) {
    return this.passengersService.updatePassenger(id, passengerData);
  }

  @Delete(':id')
  async deletePassenger(@Param('id') id: string) {
    return this.passengersService.deletePassenger(id);
  }
}
