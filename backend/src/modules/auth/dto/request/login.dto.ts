import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class LoginDto {
    @ApiProperty({ description: '用户名', example: 'admin' })
    @IsString()
    @IsNotEmpty({ message: '用户名不能为空' })
    username!: string;

    @ApiProperty({ description: '密码', example: '<PASSWORD>' })
    @IsString()
    @IsNotEmpty({ message: '密码不能为空' })
    password!: string;

    @ApiProperty({ description: '验证码', example: '123456' })
    @IsString()
    @IsNotEmpty({ message: '验证码不能为空' })
    captcha!: string;

    @ApiProperty({ description: '验证码token', example: '123456' })
    @IsString()
    @IsNotEmpty({ message: '验证码uuid不能为空' })
    uuid!: string;
}