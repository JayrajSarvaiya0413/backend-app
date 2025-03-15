import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airline: string;

  @Column()
  flight_number: string;

  @Column()
  source: string;

  @Column()
  destination: string;

  @Column()
  departure_time: Date;

  @Column()
  arrival_time: Date;

  @Column()
  total_seats: number;

  @Column()
  available_seats: number;

  @Column()
  price: number;
}
