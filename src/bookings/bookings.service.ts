import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { Flight } from '../flights/flights.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    private emailService: EmailService,
  ) {}

  async bookFlight(
    user_email: string,
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
      user_id: user_email,
      flight,
      passenger_name,
      seat_number,
      status: 'confirmed',
    });

    await this.bookingRepository.save(booking);

    // Send email confirmation
    await this.emailService.sendBookingConfirmation(user_email, flight);

    return booking;
  }
}
