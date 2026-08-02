// src/modules/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { BCRYPT_SALT_ROUNDS } from 'src/constants';
import { PaginateQuery } from 'nestjs-paginate';
import { paginateData } from 'src/common/utils/pagination';
import { UpdateUserDto } from './dto/request/updateUserInfo.dto';

@Injectable()
export class UserService {
  // 注入user仓库
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 根据用户名查询用户（登录场景使用）
  async findUserByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  // 创建用户
  async createUser(data: Partial<User>) {
    // 判断用户名或手机号是否已存在
    const existUser = await this.userRepo.findOne({
      where: [{ username: data.username }, { phone: data.phone }],
    });
    if (existUser) {
      const field = existUser.username === data.username ? '用户名' : '手机号';
      throw new BadRequestException(`${field}已存在`);
    }
    //加密用户密码
    if(data.password){
      data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  // 根据id查询
  async findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  // 查询用户列表
  async getUserList(query: PaginateQuery) {
    return paginateData(query, this.userRepo, {
      sortableColumns: ['id', 'username', 'nickname', 'createTime'],
      searchableColumns: ['username', 'nickname'],
      defaultSortBy: [['createTime', 'DESC']],
    });
  }

  // 删除用户
  async deleteUser(id: number){
    return this.userRepo.softDelete(id);
  }

  // 更新用户
  async updateUser(dto: UpdateUserDto){
    const {id, ...data} = dto;
    if(data.password){
      data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }
    return this.userRepo.update(id, data);
  }
}
