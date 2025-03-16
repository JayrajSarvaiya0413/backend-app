import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightBooking } from './flight-booking.entity';

@Injectable()
export class FlightBookingsService {
  constructor(
    @InjectRepository(FlightBooking)
    private flightBookingRepository: Repository<FlightBooking>,
  ) {}

  async findByBookingId(bookingId: string): Promise<FlightBooking[]> {
    return this.flightBookingRepository.find({
      where: { booking: { id: bookingId } },
      relations: ['flight'],
    });
  }

  async createFlightBooking(
    flightBookingData: Partial<FlightBooking>,
  ): Promise<FlightBooking> {
    const flightBooking =
      this.flightBookingRepository.create(flightBookingData);
    return this.flightBookingRepository.save(flightBooking);
  }

  async updateFlightBooking(
    id: string,
    flightBookingData: Partial<FlightBooking>,
  ): Promise<FlightBooking> {
    await this.flightBookingRepository.update(id, flightBookingData);
    return this.flightBookingRepository.findOne({
      where: { id },
      relations: ['flight'],
    });
  }

  async deleteFlightBooking(id: string): Promise<void> {
    await this.flightBookingRepository.delete(id);
  }
}
