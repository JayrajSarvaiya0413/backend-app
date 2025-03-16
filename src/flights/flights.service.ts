import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Flight } from './flights.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async searchFlights(source: string, destination: string, date: Date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set to end of the day
    const data = await this.flightRepository.find({
      where: {
        source,
        destination,
        departure_time: Between(startDate, endDate),
      },
      relations: ['cabinClasses'],
    });
    return data;
  }

  async getFlightById(id: string): Promise<Flight> {
    const flight = await this.flightRepository.findOne({
      where: { id },
      relations: ['cabinClasses'],
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    return flight;
  }

  async updateFlightStatus(flight_id: string, status: string) {
    const flight = await this.flightRepository.findOne({
      where: { id: flight_id },
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    flight.status = status;
    return this.flightRepository.save(flight);
  }
}
