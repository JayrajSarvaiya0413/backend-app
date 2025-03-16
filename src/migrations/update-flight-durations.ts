import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from '../flights/flights.entity';

@Injectable()
export class FlightDurationMigration {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async migrate(): Promise<void> {
    console.log('Starting flight duration migration...');

    // Get all flights without duration
    const flights = await this.flightRepository.find({
      where: { duration: null },
    });

    console.log(`Found ${flights.length} flights without duration values`);

    // Update each flight with calculated duration
    for (const flight of flights) {
      const departureTime = new Date(flight.departure_time);
      const arrivalTime = new Date(flight.arrival_time);

      // Calculate duration in minutes
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));

      flight.duration = durationMinutes;

      await this.flightRepository.save(flight);
      console.log(
        `Updated flight ${flight.id} with duration: ${durationMinutes} minutes`,
      );
    }

    console.log('Flight duration migration completed successfully');
  }
}
