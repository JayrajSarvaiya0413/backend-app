import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Passenger } from '../passengers/passenger.entity';
import { FlightBooking } from '../flight-bookings/flight-booking.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  booking_reference: string;

  @Column({ nullable: true })
  booking_date: Date;

  @Column('decimal', { nullable: true })
  total_amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled

  @Column({ nullable: true })
  payment_method_id: string;

  @OneToMany(() => Passenger, (passenger) => passenger.booking)
  passengers: Passenger[];

  @OneToMany(() => FlightBooking, (flightBooking) => flightBooking.booking)
  flightBookings: FlightBooking[];
}
