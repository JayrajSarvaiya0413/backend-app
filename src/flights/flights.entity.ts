import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CabinClass } from '../cabin-classes/cabin-class.entity';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ nullable: true })
  duration: number; // in minutes

  @Column({ nullable: true })
  aircraft_type: string;

  @Column({ default: 'On Time' })
  status: string;

  @OneToMany(() => CabinClass, (cabinClass) => cabinClass.flight)
  cabinClasses: CabinClass[];
}
