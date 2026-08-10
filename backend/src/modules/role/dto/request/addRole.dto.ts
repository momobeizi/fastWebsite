import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn, Min, Length } from "class-validator";

export class AddRoleDto {
    @ApiProperty({ description: '角色名称', example: '管理员' })
    @IsNotEmpty({ message: '角色名称不能为空' })
    @IsString({ message: '角色名称必须是字符串' })
    @Length(1, 50, { message: '角色名称最长50个字符' })
    name: string;

    @ApiProperty({ description: '角色编码', example: 'admin' })
    @IsNotEmpty({ message: '角色编码不能为空' })
    @IsString({ message: '角色编码必须是字符串' })
    @Length(1, 50, { message: '角色编码最长50个字符' })
    code: string;

    @ApiPropertyOptional({ description: '角色描述', example: '系统最高权限角色' })
    @IsOptional()
    @IsString({ message: '角色描述必须是字符串' })
    @Length(0, 200, { message: '角色描述最长200个字符' })
    description?: string;

    @ApiPropertyOptional({ description: '状态(0:禁用，1:启用)', example: 1, default: 1 })
    @IsOptional()
    @IsInt({ message: '状态必须是整数' })
    @IsIn([0, 1], { message: '状态只能是 0 或 1' })
    status?: number;

    @ApiPropertyOptional({ description: '排序', example: 0, default: 0 })
    @IsOptional()
    @IsInt({ message: '排序必须是整数' })
    @Min(0, { message: '排序最小为0' })
    sort?: number;

    @ApiProperty({ description: '菜单ID列表', example: [1, 2, 3], type: [Number] })
    @IsOptional()
    @IsInt({ each: true, message: '菜单ID必须是整数' })
    menuIds?: number[];
}