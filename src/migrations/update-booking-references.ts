import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../bookings/bookings.entity';

@Injectable()
export class BookingReferenceMigration {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async migrate(): Promise<void> {
    console.log('Starting booking reference migration...');

    // Get all bookings without booking_reference
    const bookings = await this.bookingRepository.find({
      where: { booking_reference: null },
    });

    console.log(`Found ${bookings.length} bookings without reference values`);

    // Update each booking with a generated reference
    for (const booking of bookings) {
      const bookingReference = this.generateBookingReference();

      booking.booking_reference = bookingReference;
      booking.booking_date = booking.booking_date || new Date();
      booking.total_amount = booking.total_amount || 0;

      await this.bookingRepository.save(booking);
      console.log(
        `Updated booking ${booking.id} with reference: ${bookingReference}`,
      );
    }

    console.log('Booking reference migration completed successfully');
  }

  private generateBookingReference(): string {
    // Generate a unique 6-character alphanumeric booking reference
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  }
}
