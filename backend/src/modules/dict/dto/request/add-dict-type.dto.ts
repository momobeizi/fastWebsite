import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn, Length } from 'class-validator';

export class AddDictTypeDto {
  @ApiProperty({ description: '字典名称', example: '用户性别' })
  @IsNotEmpty({ message: '字典名称不能为空' })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({ description: '字典编码', example: 'user_gender' })
  @IsNotEmpty({ message: '字典编码不能为空' })
  @IsString()
  @Length(1, 50)
  code: string;

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
