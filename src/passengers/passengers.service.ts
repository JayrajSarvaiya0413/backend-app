import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './passenger.entity';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  async findByBookingId(bookingId: string): Promise<Passenger[]> {
    return this.passengerRepository.find({
      where: { booking: { id: bookingId } },
    });
  }

  async createPassenger(passengerData: Partial<Passenger>): Promise<Passenger> {
    const passenger = this.passengerRepository.create(passengerData);
    return this.passengerRepository.save(passenger);
  }

  async updatePassenger(
    id: string,
    passengerData: Partial<Passenger>,
  ): Promise<Passenger> {
    await this.passengerRepository.update(id, passengerData);
    return this.passengerRepository.findOne({ where: { id } });
  }

  async deletePassenger(id: string): Promise<void> {
    await this.passengerRepository.delete(id);
  }
}
