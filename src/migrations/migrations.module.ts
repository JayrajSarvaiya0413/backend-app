import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from '../flights/flights.entity';
import { CabinClass } from '../cabin-classes/cabin-class.entity';
import { Booking } from '../bookings/bookings.entity';
import { FlightDurationMigration } from './update-flight-durations';
import { BookingReferenceMigration } from './update-booking-references';
import { DataSeeder } from './seed-data';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, CabinClass, Booking])],
  providers: [FlightDurationMigration, BookingReferenceMigration, DataSeeder],
  exports: [FlightDurationMigration, BookingReferenceMigration, DataSeeder],
})
export class MigrationsModule {}
