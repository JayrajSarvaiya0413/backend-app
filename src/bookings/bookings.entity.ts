import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Flight } from '../flights/flights.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @ManyToOne(() => Flight)
  flight: Flight;

  @Column()
  passenger_name: string;

  @Column()
  seat_number: string;

  @Column({ default: 'pending' })
  status: string;
}
