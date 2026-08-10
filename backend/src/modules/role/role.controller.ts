import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddRoleDto } from "./dto/request/addRole.dto";
import type { PaginateQuery } from "nestjs-paginate";
import { UpdateRoleDto } from "./dto/request/updateRole.dto";

@ApiTags('角色管理')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post('/add')
    @ApiOperation({ summary: '添加角色' })
    addRole(@Body() dto: AddRoleDto) {
        return this.roleService.addRole(dto)
    }

    @Get('/list')
    @ApiOperation({ summary: '分页查询角色列表' })
    getRoleList(@Query() query : PaginateQuery) {
        return this.roleService.getRoleList(query)
    }

    @Get('/info/:id')
    @ApiOperation({ summary: '查询角色详情' })
    getRoleInfo(@Param('id') id: number) {
        return this.roleService.getRoleInfo(id)
    }

    @Post('/update')
    @ApiOperation({ summary: '更新角色' })
    updateRole(@Body() dto: UpdateRoleDto) {
        return this.roleService.updateRole(dto)
    }

    @Get('/delete/:id')
    @ApiOperation({ summary: '删除角色' })
    deleteRole(@Param('id') id: number) {
        return this.roleService.deleteRole(id)
    }

    @Get('/all')
    @ApiOperation({ summary: '获取所有角色' })
    getAllRoles() {
        return this.roleService.getAllRoles()
    }
    
}