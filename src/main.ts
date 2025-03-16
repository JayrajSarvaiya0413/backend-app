import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlightDurationMigration } from './migrations/update-flight-durations';
import { BookingReferenceMigration } from './migrations/update-booking-references';
import { DataSeeder } from './migrations/seed-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Run migrations
  try {
    // Run flight duration migration
    const flightMigrationService = app.get(FlightDurationMigration);
    await flightMigrationService.migrate();

    // Run booking reference migration
    const bookingMigrationService = app.get(BookingReferenceMigration);
    await bookingMigrationService.migrate();

    // Seed data
    const seederService = app.get(DataSeeder);
    await seederService.seed();
  } catch (error) {
    console.error('Error running migrations or seeding data:', error);
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
