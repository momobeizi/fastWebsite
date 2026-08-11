import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CaptchaModule } from './common/captcha/captcha.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { LogModule } from './modules/log/log.module';
import { DictModule } from './modules/dict/dict.module';
import { WebsiteModule } from './modules/website/website.module';
import { AuthGuard } from './common/guards/auth.guard';

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
    MenuModule, // 菜单模块
    RoleModule, // 角色模块
    LogModule, // 请求日志模块
    DictModule, // 数据字典模块
    WebsiteModule, // 官网管理模块
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
