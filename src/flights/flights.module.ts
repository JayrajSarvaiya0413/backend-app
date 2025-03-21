import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flights.entity';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  providers: [FlightsService],
  controllers: [FlightsController],
})
export class FlightsModule {}
