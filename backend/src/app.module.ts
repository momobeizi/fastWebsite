import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';

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
    DatabaseModule,
    UserModule //用户模块
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
