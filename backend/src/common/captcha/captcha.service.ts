import { Injectable, Inject } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { RedisKey } from 'src/constants';

export interface CaptchaResult {
  uuid: string;
  svg: string;
  answer: string;
}

@Injectable()
export class CaptchaService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  /**
   * 生成验证码
   * @returns { uuid, svg, answer }
   */
  async generate(): Promise<CaptchaResult> {
    const uuid = uuidv4();
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      noise: 3,
      color: true,
      background: '#f0f0f0',
    });

    // 存 redis，60 秒过期
    await this.redis.set(RedisKey.captcha(uuid), captcha.text.toLowerCase(), 'EX', 60);

    return {
      uuid,
      svg: captcha.data,
      answer: captcha.text.toLowerCase(),
    };
  }

  /**
   * 校验验证码
   * @param uuid 验证码唯一标识
   * @param code 用户输入的验证码
   * @returns 是否通过
   */
  async verify(uuid: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(RedisKey.captcha(uuid));
    if (!stored) return false;

    // 验证后删除，防止重复使用
    await this.redis.del(RedisKey.captcha(uuid));
    return stored === code.toLowerCase();
  }
}
