import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class AddMenuDto {
    @ApiProperty({ description: '菜单名称' })
    @IsString()
    @Length(1, 50, { message: '菜单名称长度必须在1-50之间' })
    name: string;

    @ApiProperty({ description: '菜单路径' })
    @IsString()
    @IsOptional()
    @Length(1, 100, { message: '菜单路径长度必须在1-100之间' })
    path?: string;

    @ApiProperty({ description: '菜单组件' })
    @IsString()
    @IsOptional()
    @Length(1, 100, { message: '菜单组件长度必须在1-100之间' })
    component?: string;

    @ApiProperty({ description: '菜单图标' })
    @IsString()
    @IsOptional()
    @Length(1, 50, { message: '菜单图标长度必须在1-100之间' })
    icon?: string;

    @ApiProperty({ description: '父级id' })
    @IsInt()
    @IsOptional()
    parentId: number;

    @ApiProperty({ description: '状态' })
    @IsInt()
    @IsOptional()
    staus: number;

    @ApiProperty({ description: '菜单权限' })
    @IsString()
    @IsOptional()
    @Length(1, 255, { message: '菜单权限长度必须在1-255之间' })
    permission: string;

    @ApiProperty({ description: '菜单类型' })
    @IsInt()
    type: number

    @ApiProperty({ description: '排序' })
    @IsInt()
    @IsOptional()
    sort?: number;

    @ApiProperty({ description: '是否外链' })
    @IsInt()
    @IsOptional()
    isLink: number;

    @ApiProperty({ description: '是否显示' })
    @IsInt()
    @IsOptional()
    visible: number;

    @ApiProperty({ description: '是否缓存' })
    @IsInt()
    @IsOptional()
    keepAlive: number;
}