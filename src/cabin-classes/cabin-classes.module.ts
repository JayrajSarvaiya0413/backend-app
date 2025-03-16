import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabinClass } from './cabin-class.entity';
import { CabinClassesService } from './cabin-classes.service';
import { CabinClassesController } from './cabin-classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CabinClass])],
  providers: [CabinClassesService],
  controllers: [CabinClassesController],
  exports: [CabinClassesService],
})
export class CabinClassesModule {}
