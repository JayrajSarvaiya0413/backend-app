import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flights.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async searchFlights(source: string, destination: string, date: Date) {
    const data = await this.flightRepository.find({
      where: { source, destination, departure_time: date },
    });
    return data;
  }
}
