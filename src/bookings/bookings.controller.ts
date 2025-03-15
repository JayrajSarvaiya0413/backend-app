import { Controller, Post, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('create')
  async bookFlight(
    @Body()
    body: {
      user_id: string;
      flight_id: number;
      passenger_name: string;
      seat_number: string;
    },
  ) {
    return this.bookingsService.bookFlight(
      body.user_id,
      body.flight_id,
      body.passenger_name,
      body.seat_number,
    );
  }
}
