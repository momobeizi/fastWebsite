import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";
import { AddMenuDto } from "./dto/request/addMenu.dto";
import { arrayToTree } from "src/common/utils";
import { UpdateMenuDto } from "./dto/request/updateMenu.dto";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepo: Repository<Menu>,
    ) { }

    async getMenuList() {
        return await this.menuRepo.find()
    }

    // 添加菜单
    async addMenu(dto: AddMenuDto) {
        return await this.menuRepo.insert(dto)
    }

    //获取当前用户拥有的菜单
    async getCurrentUserMenus() {
        const menuList = await this.menuRepo.find({ where: { status: 1 } })
        return arrayToTree(menuList, 'id', 'parentId', 'children')
    }

    //根据菜单id 获取菜单详情
    async getMenuById(id: number) {
        return await this.menuRepo.findOne({ where: { id } })
    }

    //更新菜单
    async updateMenu(dto: UpdateMenuDto) {
        return await this.menuRepo.update(dto.id, dto)
    }

    //删除菜单
    async deleteMenu(id: number) {
        //todo: 后续删除的时候需要判断当前菜单有没有被角色绑定
        return await this.menuRepo.delete(id)
    }
}