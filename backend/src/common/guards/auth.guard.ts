import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisKey } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'] || '';
    const token = auth.replace('Bearer ', '');

    if (!token) {
      return true; // 未登录不拦截，request.user 为空
    }

    try {
      const userStr = await this.redis.get(RedisKey.loginUserInfo(token));
      if (userStr) {
        request.user = JSON.parse(userStr);
      }
    } catch {
      // 解析失败不拦截
    }

    return true; // 不拦截，只负责挂载用户信息
  }
}
