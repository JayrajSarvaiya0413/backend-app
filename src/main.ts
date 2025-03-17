import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlightDurationMigration } from './migrations/update-flight-durations';
import { BookingReferenceMigration } from './migrations/update-booking-references';
import { DataSeeder } from './migrations/seed-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with configuration for production
  app.enableCors({
    origin: [
      'http://localhost:5175', // Local development frontend
      'https://thena-flight-booking.vercel.app', // Add your production frontend URL here
      'https://thena-flight-booking.netlify.app', // Add alternative frontend URL if needed
      /\.vercel\.app$/, // Allow all Vercel preview deployments
      /\.netlify\.app$/, // Allow all Netlify preview deployments
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

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
