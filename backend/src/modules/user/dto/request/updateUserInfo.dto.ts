import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsPhoneNumber,
    IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    /**
     * 用户id
     */
    @ApiProperty({ description: '用户id', example: 1 })
    @IsNotEmpty({ message: '用户id不能为空' })
    id!: number;

    /**
     * 密码
     */
    @ApiProperty({ description: '密码', example: ' 750110' })
    @IsString()
    @IsNotEmpty({ message: '密码不能为空' })
    @Length(6, 32, { message: '密码长度6~32位' })
    password?: string;

    /**
     * 昵称【选填】
     */
    @ApiProperty({ description: '昵称', example: '管理员' })
    @IsString()
    @IsOptional()
    @Length(1, 50, { message: '昵称最大50个字' })
    nickname?: string;

    /**
     * 头像【选填】
     */
    @ApiProperty({ description: '头像', example: 'xxxx' })
    @IsString()
    @IsOptional()
    avatar?: string;

    /**
     * 手机号【选填】
     */
    @ApiProperty({ description: '手机号', example: '17623142317' })
    @IsPhoneNumber('CN', { message: '手机号格式不正确' })
    @IsOptional()
    phone?: string;

    /**
     * 角色
     */
    @ApiProperty({ description: '角色', example: 'admin' })
    @IsString()
    @IsIn(['admin', 'editor'], { message: '角色只能是 admin / editor' })
    @IsOptional()
    role?: string;

    /**
     * 状态
     */
    @ApiProperty({ description: '状态(0:禁用，1:启用)', example: 1 })
    @IsOptional()
    status?: number;
}
