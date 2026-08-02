import { Inject } from '@nestjs/common';
import { REDIS_TOKEN } from './redis.provider';

export const InjectRedis = () => Inject(REDIS_TOKEN);
