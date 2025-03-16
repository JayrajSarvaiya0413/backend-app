import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FlightBookingsService } from './flight-bookings.service';
import { FlightBooking } from './flight-booking.entity';

@Controller('flight-bookings')
export class FlightBookingsController {
  constructor(private readonly flightBookingsService: FlightBookingsService) {}

  @Get('booking/:bookingId')
  async findByBookingId(@Param('bookingId') bookingId: string) {
    return this.flightBookingsService.findByBookingId(bookingId);
  }

  @Post()
  async createFlightBooking(@Body() flightBookingData: Partial<FlightBooking>) {
    return this.flightBookingsService.createFlightBooking(flightBookingData);
  }

  @Patch(':id')
  async updateFlightBooking(
    @Param('id') id: string,
    @Body() flightBookingData: Partial<FlightBooking>,
  ) {
    return this.flightBookingsService.updateFlightBooking(
      id,
      flightBookingData,
    );
  }

  @Delete(':id')
  async deleteFlightBooking(@Param('id') id: string) {
    return this.flightBookingsService.deleteFlightBooking(id);
  }
}
