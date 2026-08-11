import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from './entities/request-log.entity';
import { paginateData } from 'src/common/utils/pagination';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly logRepo: Repository<RequestLog>,
  ) {}

  // 分页查询日志
  async getLogList(query: PaginateQuery) {
    return paginateData(query, this.logRepo, {
      sortableColumns: ['id', 'url', 'method', 'duration', 'createTime'],
      searchableColumns: ['url', 'username'],
      defaultSortBy: [['createTime', 'DESC']],
    });
  }

  // 删除单条日志
  async deleteLog(id: number) {
    return this.logRepo.delete(id);
  }

  // 清空所有日志
  async clearLogs() {
    return this.logRepo.clear();
  }
}
