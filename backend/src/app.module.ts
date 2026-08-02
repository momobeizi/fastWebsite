import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CaptchaModule } from './common/captcha/captcha.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 全局启用配置模块
    ConfigModule.forRoot({
      // 根据NODE\_ENV加载不同env文件
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env',
      isGlobal: true, // 全局可用，不用每个模块重复导入
    }),
    RedisModule,
    DatabaseModule,
    UserModule, //用户模块
    CaptchaModule, //验证码模块
    AuthModule, // 鉴权模块(登录、注册、修改密码)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
