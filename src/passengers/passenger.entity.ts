import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from '../bookings/bookings.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.passengers)
  booking: Booking;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  passport_number: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  passenger_type: string; // adult, child, infant
}
