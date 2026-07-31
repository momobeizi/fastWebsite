import { IsOptional, IsInt, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageDto } from 'src/common/dto/page.dto';

export class GetUserListDto extends PageDto {
  /**
   * 用户名搜索
   */
  @ApiPropertyOptional({ description: '用户名搜索', example: 'admin' })
  @IsString()
  @IsOptional()
  username?: string;

  /**
   * 状态筛选
   */
  @ApiPropertyOptional({ description: '状态筛选(0:禁用，1:启用)', example: 1 })
  @Type(() => Number)
  @IsInt({ message: '状态必须是整数' })
  @IsIn([0, 1], { message: '状态只能是 0 或 1' })
  @IsOptional()
  status?: number;
}