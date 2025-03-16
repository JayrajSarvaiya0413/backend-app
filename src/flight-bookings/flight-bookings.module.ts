import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightBooking } from './flight-booking.entity';
import { FlightBookingsService } from './flight-bookings.service';
import { FlightBookingsController } from './flight-bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlightBooking])],
  providers: [FlightBookingsService],
  controllers: [FlightBookingsController],
  exports: [FlightBookingsService],
})
export class FlightBookingsModule {}
