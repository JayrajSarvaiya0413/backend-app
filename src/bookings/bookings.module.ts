import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Flight } from '../flights/flights.entity';
import { EmailService } from '../email/email.service';
import { FlightBookingsModule } from '../flight-bookings/flight-bookings.module';
import { PassengersModule } from '../passengers/passengers.module';
import { CabinClassesModule } from '../cabin-classes/cabin-classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Flight]),
    FlightBookingsModule,
    PassengersModule,
    CabinClassesModule,
  ],
  providers: [BookingsService, EmailService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
