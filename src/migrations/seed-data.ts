import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from '../flights/flights.entity';
import { CabinClass } from '../cabin-classes/cabin-class.entity';

@Injectable()
export class DataSeeder {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(CabinClass)
    private cabinClassRepository: Repository<CabinClass>,
  ) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');

    // Check if we already have flights
    const flightCount = await this.flightRepository.count();
    if (flightCount > 0) {
      console.log(
        `Database already has ${flightCount} flights. Skipping seed.`,
      );
      return;
    }

    // Create sample flights
    const flights = await this.createSampleFlights();

    // Create cabin classes for each flight
    await this.createCabinClasses(flights);

    console.log('Database seeding completed successfully');
  }

  private async createSampleFlights(): Promise<Flight[]> {
    const flights: Flight[] = [];

    // Sample airports
    const airports = [
      { code: 'JFK', name: 'John F. Kennedy International Airport' },
      { code: 'LAX', name: 'Los Angeles International Airport' },
      { code: 'SFO', name: 'San Francisco International Airport' },
      { code: 'ORD', name: "O'Hare International Airport" },
      { code: 'MIA', name: 'Miami International Airport' },
    ];

    // Sample airlines
    const airlines = [
      'American Airlines',
      'Delta Air Lines',
      'United Airlines',
      'Southwest Airlines',
      'JetBlue Airways',
    ];

    // Create flights between each pair of airports
    for (let i = 0; i < airports.length; i++) {
      for (let j = 0; j < airports.length; j++) {
        if (i === j) continue; // Skip same origin and destination

        const source = airports[i].code;
        const destination = airports[j].code;
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

        // Create departure time (between now and 30 days from now)
        const departureTime = new Date();
        departureTime.setDate(
          departureTime.getDate() + Math.floor(Math.random() * 30),
        );
        departureTime.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          0,
          0,
        );

        // Flight duration between 1 and 6 hours
        const durationMinutes = 60 + Math.floor(Math.random() * 300);

        // Calculate arrival time
        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);

        const flight = this.flightRepository.create({
          airline,
          flight_number: flightNumber,
          source,
          destination,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          duration: durationMinutes,
          aircraft_type: [
            'Boeing 737',
            'Airbus A320',
            'Boeing 787',
            'Airbus A380',
          ][Math.floor(Math.random() * 4)],
          status: 'On Time',
        });

        const savedFlight = await this.flightRepository.save(flight);
        flights.push(savedFlight);
        console.log(
          `Created flight: ${savedFlight.airline} ${savedFlight.flight_number} from ${savedFlight.source} to ${savedFlight.destination}`,
        );
      }
    }

    return flights;
  }

  private async createCabinClasses(flights: Flight[]): Promise<void> {
    const cabinClassTypes = ['Economy', 'Premium Economy', 'Business', 'First'];

    for (const flight of flights) {
      // Not all flights have all cabin classes
      const availableClasses = cabinClassTypes.slice(
        0,
        Math.floor(Math.random() * 3) + 2,
      );

      for (const classType of availableClasses) {
        // Base price depends on cabin class
        let basePrice = 100;
        if (classType === 'Premium Economy') basePrice = 250;
        if (classType === 'Business') basePrice = 500;
        if (classType === 'First') basePrice = 1000;

        // Add some randomness to price
        const price = basePrice + Math.floor(Math.random() * basePrice * 0.5);

        // Total seats depends on cabin class
        let totalSeats = 150;
        if (classType === 'Premium Economy') totalSeats = 50;
        if (classType === 'Business') totalSeats = 30;
        if (classType === 'First') totalSeats = 10;

        // Available seats is a random number less than or equal to total seats
        const availableSeats =
          Math.floor(Math.random() * (totalSeats * 0.3)) +
          Math.floor(totalSeats * 0.7);

        const cabinClass = this.cabinClassRepository.create({
          flight,
          class_type: classType,
          price,
          total_seats: totalSeats,
          available_seats: availableSeats,
        });

        await this.cabinClassRepository.save(cabinClass);
        console.log(
          `Created ${classType} class for flight ${flight.flight_number} with ${availableSeats}/${totalSeats} seats available at $${price}`,
        );
      }
    }
  }
}
