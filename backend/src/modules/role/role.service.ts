import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { RoleMenu } from "./entities/role-menu.entity";
import { Repository, DataSource } from "typeorm";
import { AddRoleDto } from "./dto/request/addRole.dto";
import { UpdateRoleDto } from "./dto/request/updateRole.dto";
import { paginateData } from "src/common/utils/pagination";
import { PaginateQuery } from "nestjs-paginate";


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(RoleMenu) private readonly roleMenuRepository: Repository<RoleMenu>,
        private readonly dataSource: DataSource,
    ) { }

    // 添加角色
    async addRole(dto: AddRoleDto) {
        const { menuIds, ...roleData } = dto;
        // 添加角色前，先判断角色名是否已存在
        const existRole = await this.roleRepository.findOneBy({ name: roleData.name });
        if (existRole) {
            throw new BadRequestException('角色名已存在');
        }
        return this.dataSource.transaction(async (manager) => {
            // 1. 插入角色
            const roleResult = await manager.insert(Role, roleData);
            const roleId = roleResult.identifiers[0].id;

            // 2. 插入角色菜单关联
            if (menuIds && menuIds.length > 0) {
                const roleMenus = menuIds.map(menuId => ({
                    roleId,
                    menuId,
                }));
                await manager.insert(RoleMenu, roleMenus);
            }

            return { id: roleId };
        });
    }

    // 分页查询角色列表
    async getRoleList(query: PaginateQuery) {
        return paginateData(query, this.roleRepository, {
            sortableColumns: ['id', 'name', 'createTime'],
            searchableColumns: ['name'],
            defaultSortBy: [['createTime', 'DESC']],
        });
    }

    // 查询角色详情
    async getRoleInfo(id: number) {
        // 需要将菜单角色绑定的角色也查出来一起返回
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) {
            throw new BadRequestException('角色不存在');
        }
        const roleMenus = await this.roleMenuRepository.find({
            where: { roleId: role.id },
            select: { menuId: true },
        });
        const menuIds = roleMenus.map(roleMenu => roleMenu.menuId);
        return { ...role, menuIds };
    }

    // 更新角色
    async updateRole(dto: UpdateRoleDto) {
        const { id, menuIds, ...roleData } = dto;

        // 先查角色是否存在
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) {
            throw new BadRequestException('角色不存在');
        }

        return this.dataSource.transaction(async (manager) => {
            // 1. 更新角色信息
            await manager.update(Role, id, roleData);

            // 2. 删除旧的菜单关联
            await manager.delete(RoleMenu, { roleId: id });

            // 3. 插入新的菜单关联
            if (menuIds && menuIds.length > 0) {
                const roleMenus = menuIds.map(menuId => ({
                    roleId: id,
                    menuId,
                }));
                await manager.insert(RoleMenu, roleMenus);
            }
        });
    }

    // 删除角色
    async deleteRole(id: number) {
        return this.dataSource.transaction(async (manager) => {
            await manager.delete(RoleMenu, { roleId: id });
            await manager.delete(Role, id);
        });
    }

    // 获取所有角色
    getAllRoles() {
        return this.roleRepository.find();
    }
}