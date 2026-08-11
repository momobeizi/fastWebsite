import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { DictType } from './entities/dict-type.entity';
import { DictData } from './entities/dict-data.entity';
import { AddDictTypeDto } from './dto/request/add-dict-type.dto';
import { UpdateDictTypeDto } from './dto/request/update-dict-type.dto';
import { AddDictDataDto } from './dto/request/add-dict-data.dto';
import { UpdateDictDataDto } from './dto/request/update-dict-data.dto';
import { paginateData } from 'src/common/utils/pagination';
import { PaginateQuery } from 'nestjs-paginate';
import { RedisKey } from 'src/constants';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(DictType)
    private readonly dictTypeRepo: Repository<DictType>,
    @InjectRepository(DictData)
    private readonly dictDataRepo: Repository<DictData>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // ========== 字典类型 ==========

  async addDictType(dto: AddDictTypeDto) {
    const exist = await this.dictTypeRepo.findOneBy({ code: dto.code });
    if (exist) throw new BadRequestException('字典编码已存在');
    return this.dictTypeRepo.insert(dto);
  }

  async getDictTypeList(query: PaginateQuery) {
    return paginateData(query, this.dictTypeRepo, {
      sortableColumns: ['id', 'name', 'code', 'createTime'],
      searchableColumns: ['name', 'code'],
      defaultSortBy: [['createTime', 'DESC']],
    });
  }

  async getDictTypeInfo(id: number) {
    return this.dictTypeRepo.findOneBy({ id });
  }

  async updateDictType(dto: UpdateDictTypeDto) {
    const { id, ...data } = dto;
    const exist = await this.dictTypeRepo.findOneBy({ id });
    if (!exist) throw new BadRequestException('字典类型不存在');
    return this.dictTypeRepo.update(id, data);
  }

  async deleteDictType(id: number) {
    const dictType = await this.dictTypeRepo.findOneBy({ id });
    if (!dictType) throw new BadRequestException('字典类型不存在');
    // 同时删除关联的字典数据
    await this.dictDataRepo.delete({ typeCode: dictType.code });
    await this.clearDictCache(dictType.code);
    return this.dictTypeRepo.delete(id);
  }

  // ========== 字典数据 ==========

  async addDictData(dto: AddDictDataDto) {
    const result = await this.dictDataRepo.insert(dto);
    await this.clearDictCache(dto.typeCode);
    return result;
  }

  async getDictDataList(query: PaginateQuery) {
    return paginateData(query, this.dictDataRepo, {
      sortableColumns: ['id', 'label', 'value', 'sort', 'createTime'],
      searchableColumns: ['label', 'value'],
      defaultSortBy: [['sort', 'ASC']],
      filterableColumns: { typeCode: true },
    });
  }

  async getDictDataInfo(id: number) {
    return this.dictDataRepo.findOneBy({ id });
  }

  async updateDictData(dto: UpdateDictDataDto) {
    const { id, ...data } = dto;
    const result = await this.dictDataRepo.update(id, data);
    await this.clearDictCache(dto.typeCode);
    return result;
  }

  async deleteDictData(id: number) {
    const item = await this.dictDataRepo.findOneBy({ id });
    const result = await this.dictDataRepo.delete(id);
    if (item) {
      await this.clearDictCache(item.typeCode);
    }
    return result;
  }

  /** 根据字典编码获取启用的字典数据列表（供前端下拉框使用，带 redis 缓存） */
  async getDictDataByCode(code: string) {
    const cacheKey = RedisKey.dictData(code);

    // 先查缓存
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 查数据库
    const data = await this.dictDataRepo.find({
      where: { typeCode: code, status: 1 },
      order: { sort: 'ASC' },
    });

    // 写入缓存，1 小时过期（字典数据变动不频繁）
    await this.redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);

    return data;
  }

  /** 清除指定字典编码的缓存 */
  private async clearDictCache(code: string) {
    await this.redis.del(RedisKey.dictData(code));
  }
}
