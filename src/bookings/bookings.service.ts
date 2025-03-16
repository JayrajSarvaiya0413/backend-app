import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

// Define a more specific type for booking data
interface BookingCreateData extends Partial<Booking> {
  contact_email?: string;
  outbound_flight_id?: string;
  return_flight_id?: string;
  cabin_class?: string;
  passengers?: any[];
  contact_phone?: string;
  payment_method?: string;
  payment_details?: any;
  outbound_flight_details?: any; // For email confirmation
  return_flight_details?: any; // For email confirmation
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private emailService: EmailService,
  ) {}

  async findByUserId(userId: string): Promise<Booking[]> {
    this.logger.log(`Finding bookings for user: ${userId}`);
    return this.bookingRepository.find({
      where: { user_id: userId },
      relations: ['passengers', 'flightBookings', 'flightBookings.flight'],
    });
  }

  async findById(id: string): Promise<Booking> {
    this.logger.log(`Finding booking with ID: ${id}`);
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['passengers', 'flightBookings', 'flightBookings.flight'],
    });

    if (!booking) {
      this.logger.error(`Booking not found with ID: ${id}`);
      throw new Error('Booking not found');
    }

    return booking;
  }

  async createBooking(bookingData: BookingCreateData): Promise<Booking> {
    this.logger.log('Creating new booking');

    // Generate a unique booking reference
    const bookingReference = this.generateBookingReference();
    this.logger.log(`Generated booking reference: ${bookingReference}`);

    const booking = this.bookingRepository.create({
      ...bookingData,
      booking_reference: bookingReference,
      booking_date: new Date(),
    });

    const savedBooking = await this.bookingRepository.save(booking);
    this.logger.log(`Booking saved with ID: ${savedBooking.id}`);

    // Send booking confirmation email
    if (bookingData.contact_email) {
      try {
        this.logger.log(
          `Sending booking confirmation email to: ${bookingData.contact_email}`,
        );

        // Prepare flight details for email
        const flightDetails = {
          booking_reference: bookingReference,
          source:
            bookingData.outbound_flight_details?.source || 'Not specified',
          destination:
            bookingData.outbound_flight_details?.destination || 'Not specified',
          departure_time:
            bookingData.outbound_flight_details?.departure_time ||
            new Date().toISOString(),
          return_flight: bookingData.return_flight_details
            ? {
                source:
                  bookingData.return_flight_details.source || 'Not specified',
                destination:
                  bookingData.return_flight_details.destination ||
                  'Not specified',
                departure_time:
                  bookingData.return_flight_details.departure_time ||
                  new Date().toISOString(),
              }
            : null,
          cabin_class: bookingData.cabin_class || 'Economy',
          total_amount: bookingData.total_amount || 0,
          passengers_count: bookingData.passengers?.length || 1,
        };

        await this.emailService.sendBookingConfirmation(
          bookingData.contact_email,
          flightDetails,
        );

        this.logger.log(
          `Booking confirmation email sent to ${bookingData.contact_email}`,
        );
      } catch (error) {
        this.logger.error('Failed to send booking confirmation email:', error);
        // Don't throw error, just log it
      }
    } else {
      this.logger.warn(
        'No contact email provided, skipping confirmation email',
      );
    }

    return savedBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    this.logger.log(`Updating booking status: ${id} to ${status}`);

    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      this.logger.error(`Booking not found with ID: ${id}`);
      throw new Error('Booking not found');
    }

    booking.status = status;
    const updatedBooking = await this.bookingRepository.save(booking);
    this.logger.log(`Booking status updated to: ${status}`);

    return updatedBooking;
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
