import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FlightsModule } from './flights/flights.module';
import { BookingsModule } from './bookings/bookings.module';
import { CabinClassesModule } from './cabin-classes/cabin-classes.module';
import { PassengersModule } from './passengers/passengers.module';
import { FlightBookingsModule } from './flight-bookings/flight-bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MigrationsModule } from './migrations/migrations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // This auto-syncs schema but should be false in production
    }),
    AuthModule,
    FlightsModule,
    BookingsModule,
    CabinClassesModule,
    PassengersModule,
    FlightBookingsModule,
    NotificationsModule,
    MigrationsModule,
  ],
})
export class AppModule {}
