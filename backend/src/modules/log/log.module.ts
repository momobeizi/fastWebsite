import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './entities/request-log.entity';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { RequestLogInterceptor } from './request-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [LogController],
  providers: [LogService, RequestLogInterceptor],
  exports: [RequestLogInterceptor],
})
export class LogModule {}
