import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Flight } from '../flights/flights.entity';

@Entity()
export class CabinClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Flight, (flight) => flight.cabinClasses)
  flight: Flight;

  @Column()
  class_type: string; // Economy, Premium Economy, Business, First

  @Column('decimal')
  price: number;

  @Column()
  total_seats: number;

  @Column()
  available_seats: number;
}
