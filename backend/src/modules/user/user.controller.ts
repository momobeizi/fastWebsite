// user.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@ApiTags("用户模块")
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: "创建用户" })
    @Post('/add')
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.createUser(dto);
    }

    @ApiOperation({ summary: "获取用户列表" })
    @Get('/list')
    async list(@Paginate() query: PaginateQuery) {
        return await this.userService.getUserList(query);
    }

    @ApiOperation({ summary: "根据 id 获取用户信息" })
    @Get('/info/:id')
    info(@Param('id') id: number) {
        return this.userService.findById(id);
    }
}
