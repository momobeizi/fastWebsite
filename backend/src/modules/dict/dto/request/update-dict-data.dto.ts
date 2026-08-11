import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn, Length } from 'class-validator';

export class UpdateDictDataDto {
  @ApiProperty({ description: '字典数据ID' })
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsInt()
  id: number;

  @ApiProperty({ description: '字典编码', example: 'user_gender' })
  @IsNotEmpty({ message: '字典编码不能为空' })
  @IsString()
  typeCode: string;

  @ApiProperty({ description: '字典标签', example: '男' })
  @IsNotEmpty({ message: '字典标签不能为空' })
  @IsString()
  @Length(1, 100)
  label: string;

  @ApiProperty({ description: '字典值', example: 'male' })
  @IsNotEmpty({ message: '字典值不能为空' })
  @IsString()
  @Length(1, 100)
  value: string;

  @ApiPropertyOptional({ description: '排序', example: 0 })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiPropertyOptional({ description: '状态 0禁用 1启用', example: 1 })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  status?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}
