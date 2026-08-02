import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/request/login.dto";
import { Ip } from "src/common/decorators/ip.decorator";

@ApiTags("认证模块")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({summary:"获取验证码"})
    @Get('/captcha')
    getCaptcha() {
        return this.authService.getCaptcha();
    }

    @ApiOperation({ summary: "登录" })
    @Post('/login')
    login(@Body() dto: LoginDto, @Ip() ip: string) {
        return this.authService.login(dto, ip);
    }
}