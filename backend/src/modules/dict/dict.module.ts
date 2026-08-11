import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictType } from './entities/dict-type.entity';
import { DictData } from './entities/dict-data.entity';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';

@Module({
  imports: [TypeOrmModule.forFeature([DictType, DictData])],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService],
})
export class DictModule {}
