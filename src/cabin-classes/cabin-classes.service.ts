import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CabinClass } from './cabin-class.entity';
import { ILike } from 'typeorm';

@Injectable()
export class CabinClassesService {
  constructor(
    @InjectRepository(CabinClass)
    private cabinClassRepository: Repository<CabinClass>,
  ) {}

  async findByFlightId(flightId: string): Promise<CabinClass[]> {
    return this.cabinClassRepository.find({
      where: { flight: { id: flightId } },
    });
  }

  async findByFlightIdAndClassType(
    flightId: string,
    classType: string,
  ): Promise<CabinClass> {
    return this.cabinClassRepository.findOne({
      where: {
        flight: { id: flightId },
        class_type: ILike(`%${classType}%`),
      },
    });
  }

  async updateAvailableSeats(
    id: string,
    availableSeats: number,
  ): Promise<CabinClass> {
    const cabinClass = await this.cabinClassRepository.findOne({
      where: { id },
    });

    if (!cabinClass) {
      throw new Error('Cabin class not found');
    }

    cabinClass.available_seats = availableSeats;
    return this.cabinClassRepository.save(cabinClass);
  }
}
