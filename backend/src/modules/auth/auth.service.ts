import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDto } from "./dto/request/login.dto";
import { CaptchaService } from "src/common/captcha/captcha.service";
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { RedisKey } from "src/constants";
import Redis from "ioredis";


@Injectable()
export class AuthService {

    constructor(
        //注入user 仓库
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        //验证码 service
        private readonly captchaService: CaptchaService,

        @Inject('REDIS_CLIENT') private readonly redis: Redis,


    ) { }

    // 获取验证码
    async getCaptcha() {
        return this.captchaService.generate();
    }
    // 登录
    async login(dto: LoginDto, ip: string) {
        const { username, password, captcha, uuid } = dto;
        //判断验证码是否正确或者过期
        // let captchaFlag = await this.captchaService.verify(uuid, captcha)
        // if (!captchaFlag) {
        //     throw new BadRequestException('验证码错误或已过期')
        // }
        //判断用户是否存在
        const existUser = await this.userRepo.findOneBy({ username })
        if (!existUser) {
            throw new BadRequestException('用户不存在')
        }
        //判断密码是否正确
        const isMatch = await bcrypt.compare(password, existUser.password)
        console.log('compare 结果:', isMatch);

        // 手动验证：用同样方法加密明文，看和数据库是否一致
        const testHash = await bcrypt.hash(password, 10);
        console.log('新生成的 hash:', testHash);
        console.log('数据库存的 hash:', existUser.password);

        console.log('数据库 hash 长度:', existUser.password.length);
        console.log('新生成 hash 长度:', testHash.length);

        if (!isMatch) {
            throw new BadRequestException('用户名或密码错误')
        }

        //更新用户状态、登录时间、登录ip
        existUser.status = 1;
        existUser.loginTime = new Date();
        existUser.loginIp = ip;
        await this.userRepo.save(existUser);

        //1. 生成 token
        const token = uuidv4();
        //2. 查出旧 token ,如果有就删除
        const oldToken = await this.redis.get(RedisKey.token(existUser.id))
        if (oldToken) {
            await this.redis.del(RedisKey.token(existUser.id))
        }
        //3. 存储新 token
        await this.redis.set(RedisKey.token(existUser.id), token, 'EX', 24 * 60 * 60)

        //4. 存储用户信息
        await this.redis.set(RedisKey.loginUserInfo(token), JSON.stringify(existUser), 'EX', 24 * 60 * 60)

        return {
            token,
            user: existUser
        }
    }

}