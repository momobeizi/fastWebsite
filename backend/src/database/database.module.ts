import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // 自动载入所有实体（entities目录）
        entities: ['dist/modules/**/entities/*.entity.js'],
        // 迁移文件路径
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: false,
        synchronize: configService.get<boolean>('TYPEORM_SYNC'),
        logging: configService.get<boolean>('TYPEORM_LOGGING'),
        timezone: '+08:00',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
