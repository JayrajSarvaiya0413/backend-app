import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { Flight } from '../flights/flights.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async bookFlight(
    user_id: string,
    flight_id: number,
    passenger_name: string,
    seat_number: string,
  ) {
    const flight = await this.flightRepository.findOne({
      where: { id: flight_id },
    });

    if (!flight || flight.available_seats <= 0) {
      throw new Error('Flight not available');
    }

    flight.available_seats -= 1;
    await this.flightRepository.save(flight);

    const booking = this.bookingRepository.create({
      user_id,
      flight,
      passenger_name,
      seat_number,
      status: 'confirmed',
    });

    return this.bookingRepository.save(booking);
  }
}
