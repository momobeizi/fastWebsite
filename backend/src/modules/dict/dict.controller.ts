import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DictService } from './dict.service';
import { AddDictTypeDto } from './dto/request/add-dict-type.dto';
import { UpdateDictTypeDto } from './dto/request/update-dict-type.dto';
import { AddDictDataDto } from './dto/request/add-dict-data.dto';
import { UpdateDictDataDto } from './dto/request/update-dict-data.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@ApiTags('数据字典')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  // ========== 字典类型 ==========

  @ApiOperation({ summary: '新增字典类型' })
  @Post('/type/add')
  addDictType(@Body() dto: AddDictTypeDto) {
    return this.dictService.addDictType(dto);
  }

  @ApiOperation({ summary: '字典类型列表' })
  @Get('/type/list')
  getDictTypeList(@Paginate() query: PaginateQuery) {
    return this.dictService.getDictTypeList(query);
  }

  @ApiOperation({ summary: '字典类型详情' })
  @Get('/type/info/:id')
  getDictTypeInfo(@Param('id') id: number) {
    return this.dictService.getDictTypeInfo(id);
  }

  @ApiOperation({ summary: '更新字典类型' })
  @Post('/type/update')
  updateDictType(@Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateDictType(dto);
  }

  @ApiOperation({ summary: '删除字典类型' })
  @Get('/type/delete/:id')
  deleteDictType(@Param('id') id: number) {
    return this.dictService.deleteDictType(id);
  }

  // ========== 字典数据 ==========

  @ApiOperation({ summary: '新增字典数据' })
  @Post('/data/add')
  addDictData(@Body() dto: AddDictDataDto) {
    return this.dictService.addDictData(dto);
  }

  @ApiOperation({ summary: '字典数据列表' })
  @Get('/data/list')
  getDictDataList(@Paginate() query: PaginateQuery) {
    return this.dictService.getDictDataList(query);
  }

  @ApiOperation({ summary: '字典数据详情' })
  @Get('/data/info/:id')
  getDictDataInfo(@Param('id') id: number) {
    return this.dictService.getDictDataInfo(id);
  }

  @ApiOperation({ summary: '更新字典数据' })
  @Post('/data/update')
  updateDictData(@Body() dto: UpdateDictDataDto) {
    return this.dictService.updateDictData(dto);
  }

  @ApiOperation({ summary: '删除字典数据' })
  @Get('/data/delete/:id')
  deleteDictData(@Param('id') id: number) {
    return this.dictService.deleteDictData(id);
  }

  /** 根据编码获取字典数据（供前端下拉框使用，不需要分页） */
  @ApiOperation({ summary: '根据编码获取字典数据' })
  @Get('/data/code/:code')
  getDictDataByCode(@Param('code') code: string) {
    return this.dictService.getDictDataByCode(code);
  }
}
