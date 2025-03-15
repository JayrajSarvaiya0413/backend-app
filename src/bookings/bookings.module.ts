import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Flight } from '../flights/flights.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Flight])],
  providers: [BookingsService, EmailService],
  controllers: [BookingsController],
})
export class BookingsModule {}
