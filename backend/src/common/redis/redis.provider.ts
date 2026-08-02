import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_TOKEN = 'REDIS_INSTANCE';

export const RedisProvider: Provider = {
  provide: REDIS_TOKEN,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string | undefined>('REDIS_PASSWORD'),
      db: configService.get<number>('REDIS_DB', 0),
    });
  },
  inject: [ConfigService],
};
