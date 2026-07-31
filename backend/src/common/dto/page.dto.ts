import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageDto {
  @ApiPropertyOptional({ description: '当前页码', example: 1, default: 1 })
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', example: 10, default: 10 })
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数最小为1' })
  @Max(100, { message: '每页条数最大为100' })
  @IsOptional()
  limit?: number = 10;
}
