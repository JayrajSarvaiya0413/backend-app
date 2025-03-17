import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.entity';
import { FlightBookingsService } from '../flight-bookings/flight-bookings.service';
import { PassengersService } from '../passengers/passengers.service';
import { Flight } from '../flights/flights.entity';
import { CabinClassesService } from '../cabin-classes/cabin-classes.service';

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
}

@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly flightBookingsService: FlightBookingsService,
    private readonly passengersService: PassengersService,
    private readonly cabinClassesService: CabinClassesService,
  ) {}

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      this.logger.log(`Finding bookings for user: ${userId}`);
      return this.bookingsService.findByUserId(userId);
    } catch (error) {
      this.logger.error(`Error finding bookings for user ${userId}:`, error);
      throw new HttpException(
        'Failed to retrieve bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      this.logger.log(`Finding booking with ID: ${id}`);
      return this.bookingsService.findById(id);
    } catch (error) {
      this.logger.error(`Error finding booking ${id}:`, error);
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async createBooking(@Body() bookingData: BookingCreateData) {
    try {
      this.logger.log('Creating new booking');
      this.logger.debug('Booking data:');
      this.logger.debug(bookingData);

      // Validate required fields
      if (!bookingData.user_id) {
        this.logger.error('User ID is missing in the booking data');
        throw new HttpException(
          {
            message: 'User ID is required',
            details: 'Please provide a valid user ID to create a booking',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!bookingData.outbound_flight_id) {
        this.logger.error('Outbound flight ID is missing in the booking data');
        throw new HttpException(
          'Outbound flight ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Normalize cabin class
      if (!bookingData.cabin_class) {
        bookingData.cabin_class = 'economy';
      }

      const normalizedCabinClass = this.normalizeCabinClass(
        bookingData.cabin_class,
      );
      this.logger.log(`Normalized cabin class: ${normalizedCabinClass}`);
      bookingData.cabin_class = normalizedCabinClass;

      if (!bookingData.total_amount) {
        this.logger.error('Total amount is missing in the booking data');
        throw new HttpException(
          'Total amount is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!bookingData.contact_email) {
        this.logger.error('Contact email is missing in the booking data');
        throw new HttpException(
          'Contact email is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!bookingData.passengers || bookingData.passengers.length === 0) {
        this.logger.error('No passengers provided in the booking data');
        throw new HttpException(
          'At least one passenger is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check and update available seats for outbound flight
      const outboundCabinClass =
        await this.cabinClassesService.findByFlightIdAndClassType(
          bookingData.outbound_flight_id,
          bookingData.cabin_class,
        );

      if (!outboundCabinClass) {
        this.logger.error(
          `Cabin class ${bookingData.cabin_class} not found for outbound flight ${bookingData.outbound_flight_id}`,
        );
        throw new HttpException(
          `Cabin class ${bookingData.cabin_class} not available for the selected outbound flight`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const passengerCount = bookingData.passengers.length;
      if (outboundCabinClass.available_seats < passengerCount) {
        this.logger.error(
          `Not enough seats available for outbound flight. Available: ${outboundCabinClass.available_seats}, Requested: ${passengerCount}`,
        );
        throw new HttpException(
          `Not enough seats available for the outbound flight. Only ${outboundCabinClass.available_seats} seats available.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check and update available seats for return flight if exists
      let returnCabinClass = null;
      if (bookingData.return_flight_id) {
        returnCabinClass =
          await this.cabinClassesService.findByFlightIdAndClassType(
            bookingData.return_flight_id,
            bookingData.cabin_class,
          );

        if (!returnCabinClass) {
          this.logger.error(
            `Cabin class ${bookingData.cabin_class} not found for return flight ${bookingData.return_flight_id}`,
          );
          throw new HttpException(
            `Cabin class ${bookingData.cabin_class} not available for the selected return flight`,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (returnCabinClass.available_seats < passengerCount) {
          this.logger.error(
            `Not enough seats available for return flight. Available: ${returnCabinClass.available_seats}, Requested: ${passengerCount}`,
          );
          throw new HttpException(
            `Not enough seats available for the return flight. Only ${returnCabinClass.available_seats} seats available.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Create the booking
      const booking = await this.bookingsService.createBooking(bookingData);
      this.logger.log(`Booking created with ID: ${booking.id}`);

      // Create flight bookings
      const outboundFlightBooking =
        await this.flightBookingsService.createFlightBooking({
          booking: booking,
          flight: { id: bookingData.outbound_flight_id } as Flight,
          cabin_class: bookingData.cabin_class,
          price:
            bookingData.total_amount / (bookingData.return_flight_id ? 2 : 1),
        });
      this.logger.log(
        `Outbound flight booking created with ID: ${outboundFlightBooking.id}`,
      );

      let returnFlightBooking = null;
      if (bookingData.return_flight_id) {
        returnFlightBooking =
          await this.flightBookingsService.createFlightBooking({
            booking: booking,
            flight: { id: bookingData.return_flight_id } as Flight,
            cabin_class: bookingData.cabin_class,
            price: bookingData.total_amount / 2,
          });
        this.logger.log(
          `Return flight booking created with ID: ${returnFlightBooking.id}`,
        );
      }

      // Create passengers
      const passengers = [];
      for (const passengerData of bookingData.passengers) {
        const passenger = await this.passengersService.createPassenger({
          ...passengerData,
          booking: booking,
        });
        passengers.push(passenger);
        this.logger.log(`Passenger created with ID: ${passenger.id}`);
      }

      // Update available seats for outbound flight
      const newOutboundAvailableSeats =
        outboundCabinClass.available_seats - passengerCount;
      await this.cabinClassesService.updateAvailableSeats(
        outboundCabinClass.id,
        newOutboundAvailableSeats,
      );
      this.logger.log(
        `Updated available seats for outbound flight: ${newOutboundAvailableSeats}`,
      );

      // Update available seats for return flight if exists
      if (returnCabinClass) {
        const newReturnAvailableSeats =
          returnCabinClass.available_seats - passengerCount;
        await this.cabinClassesService.updateAvailableSeats(
          returnCabinClass.id,
          newReturnAvailableSeats,
        );
        this.logger.log(
          `Updated available seats for return flight: ${newReturnAvailableSeats}`,
        );
      }

      // Return the complete booking with related entities
      return {
        ...booking,
        flightBookings: [outboundFlightBooking, returnFlightBooking].filter(
          Boolean,
        ),
        passengers: passengers,
      };
    } catch (error) {
      this.logger.error('Error creating booking:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method to normalize cabin class
  private normalizeCabinClass(cabinClass: string): string {
    if (!cabinClass) return 'economy';

    // Convert to lowercase
    let normalized = cabinClass.toLowerCase().trim();

    // Handle common variations
    if (normalized.includes('premium') && normalized.includes('economy')) {
      return 'premium economy';
    } else if (
      normalized === 'premium' ||
      normalized === 'premium_economy' ||
      normalized === 'premium-economy'
    ) {
      return 'premium economy';
    } else if (normalized.includes('business')) {
      return 'business';
    } else if (normalized.includes('first')) {
      return 'first';
    } else {
      return 'economy';
    }
  }

  @Patch(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    try {
      this.logger.log(`Updating booking ${id} status to: ${body.status}`);
      return this.bookingsService.updateBookingStatus(id, body.status);
    } catch (error) {
      this.logger.error(`Error updating booking ${id} status:`, error);
      throw new HttpException(
        'Failed to update booking status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
