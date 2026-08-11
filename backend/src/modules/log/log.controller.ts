import { Controller, Get, Delete, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@ApiTags('请求日志')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiOperation({ summary: '分页查询日志列表' })
  @Get('/list')
  getLogList(@Paginate() query: PaginateQuery) {
    return this.logService.getLogList(query);
  }

  @ApiOperation({ summary: '删除单条日志' })
  @Get('/delete/:id')
  deleteLog(@Param('id') id: number) {
    return this.logService.deleteLog(id);
  }

  @ApiOperation({ summary: '清空所有日志' })
  @Post('/clear')
  clearLogs() {
    return this.logService.clearLogs();
  }
}
