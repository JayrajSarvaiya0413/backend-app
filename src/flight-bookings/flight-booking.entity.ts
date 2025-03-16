import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from '../bookings/bookings.entity';
import { Flight } from '../flights/flights.entity';

@Entity()
export class FlightBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.flightBookings)
  booking: Booking;

  @ManyToOne(() => Flight)
  flight: Flight;

  @Column({ nullable: true })
  cabin_class: string;

  @Column('decimal', { nullable: true })
  price: number;
}
